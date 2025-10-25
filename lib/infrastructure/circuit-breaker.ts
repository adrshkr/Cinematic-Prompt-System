// lib/infrastructure/circuit-breaker.ts
/**
 * Circuit Breaker pattern implementation
 * Prevents cascading failures by failing fast when a service is unhealthy
 */

import { logger } from './logger';

export enum CircuitState {
  CLOSED = 'CLOSED',       // Normal operation
  OPEN = 'OPEN',           // Circuit tripped, rejecting requests
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening circuit
  successThreshold: number;      // Number of successes needed to close circuit
  timeout: number;               // Time in ms before attempting recovery
  monitoringPeriod: number;      // Time window for counting failures
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private failures: number[] = []; // Timestamps of recent failures

  constructor(
    private name: string,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 1 minute
      monitoringPeriod: 120000, // 2 minutes
    }
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.config.timeout) {
        logger.info(`Circuit breaker ${this.name} transitioning to HALF_OPEN`, {
          previousState: this.state,
        });
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        const error = new Error(`Circuit breaker ${this.name} is OPEN`);
        logger.warn(`Circuit breaker ${this.name} rejected request`, {
          state: this.state,
          timeSinceLastFailure,
        });
        throw error;
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      logger.debug(`Circuit breaker ${this.name} success in HALF_OPEN`, {
        successCount: this.successCount,
        threshold: this.config.successThreshold,
      });

      if (this.successCount >= this.config.successThreshold) {
        logger.info(`Circuit breaker ${this.name} transitioning to CLOSED`, {
          previousState: this.state,
        });
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        this.failures = [];
      }
    }
  }

  private onFailure() {
    const now = Date.now();
    this.lastFailureTime = now;
    this.failures.push(now);

    // Clean up old failures outside monitoring period
    this.failures = this.failures.filter(
      timestamp => now - timestamp < this.config.monitoringPeriod
    );

    this.failureCount = this.failures.length;

    logger.warn(`Circuit breaker ${this.name} failure recorded`, {
      failureCount: this.failureCount,
      threshold: this.config.failureThreshold,
      state: this.state,
    });

    if (
      this.state === CircuitState.HALF_OPEN ||
      (this.state === CircuitState.CLOSED && this.failureCount >= this.config.failureThreshold)
    ) {
      logger.error(`Circuit breaker ${this.name} transitioning to OPEN`, {
        previousState: this.state,
        failureCount: this.failureCount,
      });
      this.state = CircuitState.OPEN;
      this.successCount = 0;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      recentFailures: this.failures.length,
    };
  }

  // Manual control methods (for testing/admin)
  reset() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.failures = [];
    logger.info(`Circuit breaker ${this.name} manually reset`);
  }

  forceOpen() {
    this.state = CircuitState.OPEN;
    logger.warn(`Circuit breaker ${this.name} manually opened`);
  }

  forceClose() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.failures = [];
    logger.warn(`Circuit breaker ${this.name} manually closed`);
  }
}

// Rate limiter to complement circuit breaker
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private name: string,
    private maxTokens: number,
    private refillRate: number, // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      logger.debug(`Rate limiter ${this.name} token acquired`, {
        tokensRemaining: this.tokens,
      });
      return;
    }

    // Calculate wait time
    const tokensNeeded = 1;
    const waitTime = (tokensNeeded / this.refillRate) * 1000;

    logger.warn(`Rate limiter ${this.name} throttling request`, {
      waitTime,
      tokensRemaining: this.tokens,
    });

    await new Promise(resolve => setTimeout(resolve, waitTime));
    this.refill();
    this.tokens--;
  }

  private refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // seconds
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  getStats() {
    return {
      tokensAvailable: Math.floor(this.tokens),
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
    };
  }
}
