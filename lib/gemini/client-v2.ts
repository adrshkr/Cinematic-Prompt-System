// lib/gemini/client-v2.ts
/**
 * Enhanced Gemini client with circuit breaker, rate limiting, and proper error handling
 */

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { z } from 'zod';
import { CircuitBreaker, RateLimiter } from '../infrastructure/circuit-breaker';
import { logger } from '../infrastructure/logger';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface GeminiConfig {
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  thinkingBudget?: number;
}

export interface GeminiMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalTokensUsed: number;
  totalDuration: number;
  avgDuration: number;
}

export class GeminiClientV2 {
  private circuitBreaker: CircuitBreaker;
  private rateLimiter: RateLimiter;
  private metrics: GeminiMetrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalTokensUsed: 0,
    totalDuration: 0,
    avgDuration: 0,
  };

  constructor(
    private config: GeminiConfig,
    circuitBreaker?: CircuitBreaker,
    rateLimiter?: RateLimiter
  ) {
    // Use provided or create default circuit breaker
    this.circuitBreaker = circuitBreaker || new CircuitBreaker('gemini-api', {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30000, // 30 seconds
      monitoringPeriod: 60000, // 1 minute
    });

    // Use provided or create default rate limiter
    // Gemini API: ~60 requests per minute for most tiers
    this.rateLimiter = rateLimiter || new RateLimiter('gemini-api', 60, 1); // 1 token per second = 60/min
  }

  /**
   * Generate structured content with schema validation
   */
  async generateStructuredContent<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: {
      retries?: number;
      timeout?: number;
    }
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalCalls++;

    try {
      // Acquire rate limit token
      await this.rateLimiter.acquire();

      // Execute through circuit breaker
      const result = await this.circuitBreaker.execute(async () => {
        return await this._generateWithRetries(prompt, schema, options?.retries || 2, options?.timeout);
      });

      const duration = Date.now() - startTime;
      this.metrics.successfulCalls++;
      this.updateMetrics(duration, true);

      logger.apiCall('generateStructuredContent', duration, true, {
        model: this.config.model,
        schemaType: schema.constructor.name,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.failedCalls++;
      this.updateMetrics(duration, false);

      logger.apiCall('generateStructuredContent', duration, false, {
        model: this.config.model,
        error: (error as Error).message,
      });

      throw error;
    }
  }

  /**
   * Analyze image with structured output
   */
  async analyzeImageStructured<T>(
    imageData: string,
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: {
      retries?: number;
      timeout?: number;
    }
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalCalls++;

    try {
      // Acquire rate limit token
      await this.rateLimiter.acquire();

      // Execute through circuit breaker
      const result = await this.circuitBreaker.execute(async () => {
        return await this._analyzeImageWithRetries(imageData, prompt, schema, options?.retries || 2, options?.timeout);
      });

      const duration = Date.now() - startTime;
      this.metrics.successfulCalls++;
      this.updateMetrics(duration, true);

      logger.apiCall('analyzeImageStructured', duration, true, {
        model: 'gemini-2.5-pro', // Vision always uses Pro
        schemaType: schema.constructor.name,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.metrics.failedCalls++;
      this.updateMetrics(duration, false);

      logger.apiCall('analyzeImageStructured', duration, false, {
        model: 'gemini-2.5-pro',
        error: (error as Error).message,
      });

      throw error;
    }
  }

  /**
   * Get client metrics
   */
  getMetrics(): GeminiMetrics {
    return { ...this.metrics };
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus() {
    return this.circuitBreaker.getStats();
  }

  /**
   * Get rate limiter status
   */
  getRateLimiterStatus() {
    return this.rateLimiter.getStats();
  }

  /**
   * Reset circuit breaker (admin/debug only)
   */
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
    logger.warn('Circuit breaker manually reset');
  }

  // === Private methods ===

  private async _generateWithRetries<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    retries: number,
    timeout?: number
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const apiCall = ai.models.generateContent({
          model: this.config.model,
          contents: prompt,
          config: {
            temperature: this.config.temperature,
            topP: this.config.topP,
            topK: this.config.topK,
            maxOutputTokens: this.config.maxOutputTokens,
            thinkingConfig: this.config.thinkingBudget
              ? { thinkingBudget: this.config.thinkingBudget }
              : undefined,
            responseMimeType: 'application/json',
          },
        });

        // Apply timeout if specified
        const response: GenerateContentResponse = timeout
          ? await this.withTimeout(apiCall, timeout)
          : await apiCall;

        return this.parseAndValidate(response, schema);
      } catch (error) {
        lastError = error as Error;

        // Check if it's a retryable error
        if (this.isRetryableError(error)) {
          const delay = this.getBackoffDelay(attempt);

          logger.warn(`Gemini API call failed, retrying (${attempt + 1}/${retries})`, {
            error: (error as Error).message,
            delay,
          });

          await this.sleep(delay);
          continue;
        }

        // Non-retryable error, throw immediately
        throw error;
      }
    }

    throw lastError || new Error('All retries exhausted');
  }

  private async _analyzeImageWithRetries<T>(
    imageData: string,
    prompt: string,
    schema: z.ZodSchema<T>,
    retries: number,
    timeout?: number
  ): Promise<T> {
    let lastError: Error | null = null;

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData,
      },
    };
    const textPart = { text: prompt };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const apiCall = ai.models.generateContent({
          model: 'gemini-2.5-pro', // Vision requires Pro
          contents: { parts: [imagePart, textPart] },
          config: {
            temperature: this.config.temperature,
            topP: this.config.topP,
            topK: this.config.topK,
            maxOutputTokens: this.config.maxOutputTokens,
            thinkingConfig: this.config.thinkingBudget
              ? { thinkingBudget: this.config.thinkingBudget }
              : undefined,
            responseMimeType: 'application/json',
          }
        });

        const response: GenerateContentResponse = timeout
          ? await this.withTimeout(apiCall, timeout)
          : await apiCall;

        return this.parseAndValidate(response, schema);
      } catch (error) {
        lastError = error as Error;

        if (this.isRetryableError(error)) {
          const delay = this.getBackoffDelay(attempt);

          logger.warn(`Gemini Vision API call failed, retrying (${attempt + 1}/${retries})`, {
            error: (error as Error).message,
            delay,
          });

          await this.sleep(delay);
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('All retries exhausted');
  }

  private parseAndValidate<T>(response: GenerateContentResponse, schema: z.ZodSchema<T>): T {
    let jsonText = (response.text ?? '').trim();

    // Handle markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }

    try {
      const parsed = JSON.parse(jsonText);
      return schema.parse(parsed);
    } catch (error) {
      logger.error('Failed to parse or validate Gemini response', {
        error: (error as Error).message,
        responseLength: jsonText.length,
      });

      throw new Error(`Failed to parse Gemini response: ${(error as Error).message}`);
    }
  }

  private isRetryableError(error: unknown): boolean {
    const errorMessage = (error as Error).message?.toLowerCase() || '';

    return (
      errorMessage.includes('503') ||
      errorMessage.includes('overloaded') ||
      errorMessage.includes('unavailable') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('rate limit')
    );
  }

  private getBackoffDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 16000; // 16 seconds
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 500;

    return exponentialDelay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  private updateMetrics(duration: number, success: boolean) {
    this.metrics.totalDuration += duration;
    this.metrics.avgDuration = this.metrics.totalDuration / this.metrics.totalCalls;
  }
}
