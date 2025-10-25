// lib/infrastructure/cache.ts
/**
 * Intelligent caching layer with LRU eviction and invalidation strategies
 */

import { logger } from './logger';

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of entries
  storage?: 'memory' | 'localStorage' | 'hybrid';
}

export class Cache {
  private entries = new Map<string, CacheEntry<any>>();
  private accessOrder: string[] = []; // For LRU tracking

  constructor(
    private options: CacheOptions = {
      ttl: 3600000, // 1 hour default
      maxSize: 100,
      storage: 'memory',
    }
  ) {
    // Load from localStorage if hybrid/localStorage mode
    if (options.storage === 'localStorage' || options.storage === 'hybrid') {
      this.loadFromStorage();
    }
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      ttl: ttl || this.options.ttl || 3600000,
      accessCount: 0,
      lastAccessed: now,
    };

    // Evict if at capacity
    if (this.entries.size >= (this.options.maxSize || 100)) {
      this.evictLRU();
    }

    this.entries.set(key, entry);
    this.updateAccessOrder(key);

    // Persist to localStorage if enabled
    if (this.options.storage === 'localStorage' || this.options.storage === 'hybrid') {
      this.saveToStorage(key, entry);
    }

    logger.debug('Cache set', {
      key,
      ttl: entry.ttl,
      size: this.entries.size,
    });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.entries.get(key);

    if (!entry) {
      logger.debug('Cache miss', { key });
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if expired
    if (age > entry.ttl) {
      logger.debug('Cache expired', {
        key,
        age,
        ttl: entry.ttl,
      });
      this.delete(key);
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = now;
    this.updateAccessOrder(key);

    logger.debug('Cache hit', {
      key,
      accessCount: entry.accessCount,
      age,
    });

    return entry.value as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    const deleted = this.entries.delete(key);

    if (deleted) {
      this.accessOrder = this.accessOrder.filter(k => k !== key);

      // Remove from localStorage
      if (this.options.storage === 'localStorage' || this.options.storage === 'hybrid') {
        this.removeFromStorage(key);
      }

      logger.debug('Cache delete', { key });
    }

    return deleted;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    const size = this.entries.size;
    this.entries.clear();
    this.accessOrder = [];

    if (this.options.storage === 'localStorage' || this.options.storage === 'hybrid') {
      this.clearStorage();
    }

    logger.info('Cache cleared', { previousSize: size });
  }

  /**
   * Invalidate entries matching a pattern
   */
  invalidate(pattern: RegExp): number {
    let count = 0;
    const keysToDelete: string[] = [];

    this.entries.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.delete(key);
      count++;
    });

    logger.info('Cache invalidation', {
      pattern: pattern.toString(),
      count,
    });

    return count;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let totalAccesses = 0;
    let expiredCount = 0;

    this.entries.forEach(entry => {
      totalAccesses += entry.accessCount;
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
    });

    return {
      size: this.entries.size,
      maxSize: this.options.maxSize || 100,
      totalAccesses,
      expiredCount,
      avgAccessCount: this.entries.size > 0 ? totalAccesses / this.entries.size : 0,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.entries.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));

    if (keysToDelete.length > 0) {
      logger.info('Cache cleanup', { removed: keysToDelete.length });
    }

    return keysToDelete.length;
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.entries.keys());
  }

  // === Private methods ===

  private updateAccessOrder(key: string): void {
    // Remove if exists
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;

    // Remove least recently used (first in array)
    const lruKey = this.accessOrder[0];
    logger.debug('Cache evicting LRU entry', { key: lruKey });
    this.delete(lruKey);
  }

  // === localStorage integration ===

  private getCacheStorageKey(key: string): string {
    return `cache:${key}`;
  }

  private saveToStorage(key: string, entry: CacheEntry<any>): void {
    try {
      const storageKey = this.getCacheStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch (err) {
      logger.warn('Failed to save cache entry to localStorage', { key }, err as Error);
    }
  }

  private loadFromStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache:'));
      let loaded = 0;

      keys.forEach(storageKey => {
        try {
          const data = localStorage.getItem(storageKey);
          if (data) {
            const entry: CacheEntry<any> = JSON.parse(data);
            const key = storageKey.replace('cache:', '');

            // Check if still valid
            const now = Date.now();
            if (now - entry.timestamp <= entry.ttl) {
              this.entries.set(key, entry);
              this.accessOrder.push(key);
              loaded++;
            } else {
              localStorage.removeItem(storageKey);
            }
          }
        } catch (err) {
          logger.warn('Failed to parse cache entry from localStorage', { storageKey });
        }
      });

      if (loaded > 0) {
        logger.info('Loaded cache from localStorage', { count: loaded });
      }
    } catch (err) {
      logger.warn('Failed to load cache from localStorage', {}, err as Error);
    }
  }

  private removeFromStorage(key: string): void {
    try {
      const storageKey = this.getCacheStorageKey(key);
      localStorage.removeItem(storageKey);
    } catch (err) {
      logger.warn('Failed to remove cache entry from localStorage', { key });
    }
  }

  private clearStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache:'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (err) {
      logger.warn('Failed to clear cache from localStorage');
    }
  }
}

// Agent output cache helper
export class AgentOutputCache extends Cache {
  constructor() {
    super({
      ttl: 86400000, // 24 hours for agent outputs
      maxSize: 200,
      storage: 'hybrid', // Memory + localStorage
    });
  }

  getCacheKey(agentName: string, inputHash: string): string {
    return `agent:${agentName}:${inputHash}`;
  }

  hashInput(input: any): string {
    const str = JSON.stringify(input);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  invalidateAgent(agentName: string): number {
    return this.invalidate(new RegExp(`^agent:${agentName}:`));
  }

  invalidateModule(moduleNumber: number): number {
    return this.invalidate(new RegExp(`^agent:agent-${moduleNumber}\\.`));
  }
}
