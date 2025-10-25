// services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";

// FIX: Initialize Gemini with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function webSearch(prompt: string): Promise<{ text: string, sources: GroundingChunk[] }> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Error in webSearch:", error);
    throw error;
  }
}

export async function deepDive(prompt: string): Promise<string> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in deepDive:", error);
    throw error;
  }
}
