// lib/infrastructure/di-container.ts
/**
 * Dependency Injection Container
 * Centralized management of dependencies with lifecycle control
 */

import { logger } from './logger';

export type ServiceFactory<T> = (container: DIContainer) => T;
export type ServiceLifecycle = 'singleton' | 'transient' | 'scoped';

interface ServiceRegistration<T = any> {
  factory: ServiceFactory<T>;
  lifecycle: ServiceLifecycle;
  instance?: T;
}

export class DIContainer {
  private services = new Map<string | symbol, ServiceRegistration>();
  private scoped = new Map<string | symbol, any>();
  private resolving = new Set<string | symbol>();

  /**
   * Register a service with the container
   */
  register<T>(
    key: string | symbol,
    factory: ServiceFactory<T>,
    lifecycle: ServiceLifecycle = 'singleton'
  ): void {
    if (this.services.has(key)) {
      logger.warn(`Service ${String(key)} already registered, overwriting`, {
        lifecycle,
      });
    }

    this.services.set(key, {
      factory,
      lifecycle,
    });

    logger.debug(`Service registered: ${String(key)}`, { lifecycle });
  }

  /**
   * Register a singleton instance directly
   */
  registerInstance<T>(key: string | symbol, instance: T): void {
    this.services.set(key, {
      factory: () => instance,
      lifecycle: 'singleton',
      instance,
    });

    logger.debug(`Instance registered: ${String(key)}`);
  }

  /**
   * Resolve a service from the container
   */
  resolve<T>(key: string | symbol): T {
    const registration = this.services.get(key);

    if (!registration) {
      const error = new Error(`Service ${String(key)} not registered`);
      logger.error(`Failed to resolve service`, { key: String(key) }, error);
      throw error;
    }

    // Circular dependency detection
    if (this.resolving.has(key)) {
      const error = new Error(`Circular dependency detected: ${String(key)}`);
      logger.error('Circular dependency detected', {
        key: String(key),
        chain: Array.from(this.resolving),
      }, error);
      throw error;
    }

    this.resolving.add(key);

    try {
      let instance: T;

      switch (registration.lifecycle) {
        case 'singleton':
          if (!registration.instance) {
            logger.debug(`Creating singleton instance: ${String(key)}`);
            registration.instance = registration.factory(this);
          }
          instance = registration.instance as T;
          break;

        case 'scoped':
          if (!this.scoped.has(key)) {
            logger.debug(`Creating scoped instance: ${String(key)}`);
            this.scoped.set(key, registration.factory(this));
          }
          instance = this.scoped.get(key);
          break;

        case 'transient':
          logger.debug(`Creating transient instance: ${String(key)}`);
          instance = registration.factory(this);
          break;

        default:
          throw new Error(`Unknown lifecycle: ${registration.lifecycle}`);
      }

      this.resolving.delete(key);
      return instance;
    } catch (error) {
      this.resolving.delete(key);
      throw error;
    }
  }

  /**
   * Check if a service is registered
   */
  has(key: string | symbol): boolean {
    return this.services.has(key);
  }

  /**
   * Create a new scope for scoped services
   */
  createScope(): DIContainer {
    const scopedContainer = new DIContainer();

    // Copy service registrations
    this.services.forEach((registration, key) => {
      scopedContainer.services.set(key, {
        factory: registration.factory,
        lifecycle: registration.lifecycle,
        instance: registration.lifecycle === 'singleton' ? registration.instance : undefined,
      });
    });

    logger.debug('Created new DI scope');
    return scopedContainer;
  }

  /**
   * Clear scoped instances
   */
  clearScope(): void {
    this.scoped.clear();
    logger.debug('Cleared DI scope');
  }

  /**
   * Get all registered service keys
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys()).map(k => String(k));
  }

  /**
   * Diagnostic: Get container state
   */
  getState() {
    return {
      registeredServices: this.getRegisteredServices(),
      singletonCount: Array.from(this.services.values()).filter(
        s => s.lifecycle === 'singleton' && s.instance
      ).length,
      scopedCount: this.scoped.size,
    };
  }
}

// Service keys (type-safe)
export const ServiceKeys = {
  // Infrastructure
  LOGGER: Symbol('Logger'),
  GEMINI_CLIENT: Symbol('GeminiClient'),
  CIRCUIT_BREAKER: Symbol('CircuitBreaker'),
  RATE_LIMITER: Symbol('RateLimiter'),
  CACHE: Symbol('Cache'),

  // Repositories
  DB_CLIENT: Symbol('DbClient'),
  AGENT_RUN_REPOSITORY: Symbol('AgentRunRepository'),
  PROJECT_REPOSITORY: Symbol('ProjectRepository'),

  // Factories
  AGENT_FACTORY: Symbol('AgentFactory'),

  // Config
  APP_CONFIG: Symbol('AppConfig'),
} as const;

// Global container instance
export const container = new DIContainer();
