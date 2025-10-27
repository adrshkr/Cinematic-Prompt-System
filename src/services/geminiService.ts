// src/services/geminiService.ts
import { GenerateContentResponse, GroundingChunk } from "@google/genai";
import { z } from 'zod';
import { getGoogleGenAIClient } from '../lib/gemini/client';

const SeedIdeaSchema = z.object({
  conceptBrief: z.string().describe("A 1-2 paragraph concept for a 15-second cinematic anime short, inspired by the user's keyword. It should be evocative and set a clear scene and mood."),
});

export async function webSearch(prompt: string): Promise<{ text: string, sources: GroundingChunk[] }> {
  try {
    const ai = getGoogleGenAIClient();
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
    const ai = getGoogleGenAIClient();
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

export async function generateSeedIdea(keyword: string): Promise<{ brief: string }> {
  try {
    const ai = getGoogleGenAIClient();
    const conceptPrompt = `
      Based on the user's keyword, generate a creative seed idea for a 15-second cinematic anime short film.
      The keyword is: "${keyword}"
      
      Your output must be a JSON object with one field: "conceptBrief".
      - "conceptBrief": A 1-2 paragraph concept that is evocative and sets a clear scene and mood.
    `;

    const conceptResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: conceptPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let conceptJsonText = (conceptResponse.text ?? '').trim();
    if (conceptJsonText.startsWith('```json')) {
      conceptJsonText = conceptJsonText.substring(7, conceptJsonText.length - 3).trim();
    }
    const { conceptBrief } = SeedIdeaSchema.parse(JSON.parse(conceptJsonText));
    
    return { brief: conceptBrief };

  } catch (error) {
    console.error("Error in generateSeedIdea:", error);
    throw new Error("Failed to generate a creative seed idea. The model may be busy, or the keyword might be too restrictive. Please try again with a different idea.");
  }
}