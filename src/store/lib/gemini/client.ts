// src/lib/gemini/client.ts
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { z } from 'zod';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface GeminiConfig {
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  thinkingBudget?: number;
}

export class GeminiClient {
  constructor(private config: GeminiConfig) {}
  
  private async _withRetries<T>(apiCall: () => Promise<T>): Promise<T> {
    let attempts = 0;
    const maxRetries = 3;
    let delay = 1000; // Start with 1 second

    while (attempts < maxRetries) {
        try {
            return await apiCall();
        } catch (error: any) {
            attempts++;
            let isRetryable = false;

            try {
                // The error from the SDK often has a JSON string in the message
                const errorDetails = JSON.parse(error.message);
                const errorCode = errorDetails?.error?.code;
                const errorStatus = errorDetails?.error?.status;
                if (errorCode === 503 || errorStatus === 'UNAVAILABLE') {
                    isRetryable = true;
                }
            } catch (parseError) {
                // Fallback to checking the raw string if JSON parsing fails
                const rawMessage = (error.message || '').toLowerCase();
                if (rawMessage.includes('overloaded') || rawMessage.includes('503') || rawMessage.includes('unavailable')) {
                    isRetryable = true;
                }
            }

            if (isRetryable && attempts < maxRetries) {
                const jitter = Math.random() * 500; // Add jitter to avoid thundering herd
                console.warn(`Gemini API is overloaded. Retrying in ${((delay + jitter) / 1000).toFixed(2)}s... (Attempt ${attempts}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay + jitter));
                delay *= 2; // Exponential backoff
            } else {
                throw error; // Re-throw if not a retryable error or max retries exceeded
            }
        }
    }
    // This line should ideally not be reached, but it's a type-safe fallback.
    throw new Error('Max retries reached for Gemini API call.');
  }


  async generateStructuredContent<T>(
    prompt: string,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const apiCall = () => ai.models.generateContent({
      model: this.config.model,
      contents: prompt,
      config: {
        temperature: this.config.temperature,
        topP: this.config.topP,
        topK: this.config.topK,
        maxOutputTokens: this.config.maxOutputTokens,
        thinkingConfig: this.config.thinkingBudget ? { thinkingBudget: this.config.thinkingBudget } : undefined,
        responseMimeType: 'application/json',
      },
    });

    const response: GenerateContentResponse = await this._withRetries(apiCall);
    
    let jsonText = (response.text ?? '').trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    }
    
    try {
      const parsed = JSON.parse(jsonText);
      return schema.parse(parsed);
    } catch (error) {
      console.error("Failed to parse or validate Gemini JSON response:", error);
      console.error("Raw response text:", jsonText);
      throw new Error(`Failed to parse Gemini response: ${error}`);
    }
  }

  async analyzeImageStructured<T>(imageData: string, prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData,
      },
    };
    const textPart = { text: prompt };
    
    const apiCall = () => ai.models.generateContent({
      model: 'gemini-2.5-pro', // Vision must use a capable model
      contents: { parts: [imagePart, textPart] },
      config: {
        temperature: this.config.temperature,
        topP: this.config.topP,
        topK: this.config.topK,
        maxOutputTokens: this.config.maxOutputTokens,
        thinkingConfig: this.config.thinkingBudget ? { thinkingBudget: this.config.thinkingBudget } : undefined,
        responseMimeType: 'application/json',
      }
    });

    const response: GenerateContentResponse = await this._withRetries(apiCall);
    
    let jsonText = (response.text ?? '').trim();
     if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    }

    try {
      const parsed = JSON.parse(jsonText);
      return schema.parse(parsed);
    } catch (error) {
        console.error("Failed to parse or validate Gemini Vision JSON response:", error);
        console.error("Raw response text:", jsonText);
        throw new Error(`Failed to parse Gemini Vision response: ${error}`);
    }
  }
}