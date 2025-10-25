// lib/infrastructure/bootstrap.ts
/**
 * Application bootstrap and dependency injection setup
 * Initializes all services and registers them with the DI container
 */

import { container, ServiceKeys } from './di-container';
import { logger, StorageLogHandler, MetricsHandler } from './logger';
import { CircuitBreaker, RateLimiter } from './circuit-breaker';
import { AgentOutputCache } from './cache';
import { GeminiClientV2 } from '../gemini/client-v2';

// Application configuration
export interface AppConfig {
  environment: 'development' | 'production' | 'test';
  gemini: {
    apiKey: string;
    defaultModel: 'gemini-2.5-flash' | 'gemini-2.5-pro';
    rateLimit: {
      maxRequests: number;
      perSeconds: number;
    };
  };
  cache: {
    enabled: boolean;
    maxSize: number;
    ttl: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    persistToStorage: boolean;
  };
  circuitBreaker: {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
  };
}

// Load configuration from environment variables
function loadConfig(): AppConfig {
  const isDev = import.meta.env.DEV;

  return {
    environment: isDev ? 'development' : 'production',
    gemini: {
      apiKey: import.meta.env.VITE_API_KEY || process.env.API_KEY || '',
      defaultModel: 'gemini-2.5-flash',
      rateLimit: {
        maxRequests: 60,
        perSeconds: 60, // 60 requests per minute
      },
    },
    cache: {
      enabled: true,
      maxSize: 200,
      ttl: 86400000, // 24 hours
    },
    logging: {
      level: isDev ? 'debug' : 'info',
      persistToStorage: true,
    },
    circuitBreaker: {
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30000, // 30 seconds
    },
  };
}

/**
 * Initialize the application
 * Sets up logging, DI container, and all infrastructure services
 */
export function initializeApplication(): void {
  const config = loadConfig();

  logger.info('Initializing application', {
    environment: config.environment,
  });

  // Register configuration
  container.registerInstance(ServiceKeys.APP_CONFIG, config);

  // Configure logging
  setupLogging(config);

  // Register infrastructure services
  registerInfrastructure(config);

  // Register Gemini client
  registerGeminiClient(config);

  // Register cache
  registerCache(config);

  logger.info('Application initialized successfully', {
    registeredServices: container.getRegisteredServices().length,
  });
}

function setupLogging(config: AppConfig): void {
  // Set log level based on config
  const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  logger.setMinLevel(logLevels[config.logging.level]);

  // Add storage handler if enabled
  if (config.logging.persistToStorage) {
    const storageHandler = new StorageLogHandler();
    logger.addHandler(storageHandler);

    logger.debug('Storage log handler registered');
  }

  // Add metrics handler
  const metricsHandler = new MetricsHandler();
  logger.addHandler(metricsHandler);

  container.registerInstance('MetricsHandler', metricsHandler);

  logger.debug('Logging configured', {
    level: config.logging.level,
    persistToStorage: config.logging.persistToStorage,
  });
}

function registerInfrastructure(config: AppConfig): void {
  // Register logger (singleton)
  container.registerInstance(ServiceKeys.LOGGER, logger);

  // Register circuit breaker (singleton)
  const circuitBreaker = new CircuitBreaker('gemini-api', {
    failureThreshold: config.circuitBreaker.failureThreshold,
    successThreshold: config.circuitBreaker.successThreshold,
    timeout: config.circuitBreaker.timeout,
    monitoringPeriod: 120000, // 2 minutes
  });

  container.registerInstance(ServiceKeys.CIRCUIT_BREAKER, circuitBreaker);

  logger.debug('Circuit breaker registered', config.circuitBreaker);

  // Register rate limiter (singleton)
  const rateLimiter = new RateLimiter(
    'gemini-api',
    config.gemini.rateLimit.maxRequests,
    config.gemini.rateLimit.maxRequests / config.gemini.rateLimit.perSeconds
  );

  container.registerInstance(ServiceKeys.RATE_LIMITER, rateLimiter);

  logger.debug('Rate limiter registered', {
    maxRequests: config.gemini.rateLimit.maxRequests,
    perSeconds: config.gemini.rateLimit.perSeconds,
  });
}

function registerGeminiClient(config: AppConfig): void {
  // Register factory for Gemini client
  container.register(
    ServiceKeys.GEMINI_CLIENT,
    (c) => {
      const circuitBreaker = c.resolve<CircuitBreaker>(ServiceKeys.CIRCUIT_BREAKER);
      const rateLimiter = c.resolve<RateLimiter>(ServiceKeys.RATE_LIMITER);

      return new GeminiClientV2(
        {
          model: config.gemini.defaultModel,
          temperature: 0.7,
        },
        circuitBreaker,
        rateLimiter
      );
    },
    'singleton'
  );

  logger.debug('Gemini client registered', {
    model: config.gemini.defaultModel,
  });
}

function registerCache(config: AppConfig): void {
  if (config.cache.enabled) {
    const cache = new AgentOutputCache();

    container.registerInstance(ServiceKeys.CACHE, cache);

    logger.debug('Cache registered', {
      maxSize: config.cache.maxSize,
      ttl: config.cache.ttl,
    });
  }
}

/**
 * Get application diagnostics
 */
export function getDiagnostics() {
  const circuitBreaker = container.resolve<CircuitBreaker>(ServiceKeys.CIRCUIT_BREAKER);
  const rateLimiter = container.resolve<RateLimiter>(ServiceKeys.RATE_LIMITER);
  const geminiClient = container.resolve<GeminiClientV2>(ServiceKeys.GEMINI_CLIENT);
  const cache = container.resolve<AgentOutputCache>(ServiceKeys.CACHE);
  const metricsHandler = container.resolve<MetricsHandler>('MetricsHandler');

  return {
    container: container.getState(),
    circuitBreaker: circuitBreaker.getStats(),
    rateLimiter: rateLimiter.getStats(),
    gemini: geminiClient.getMetrics(),
    cache: cache.getStats(),
    agentMetrics: metricsHandler.getAllMetrics(),
  };
}

/**
 * Shutdown handler for cleanup
 */
export function shutdown(): void {
  logger.info('Application shutting down');

  // Clear cache if needed
  try {
    const cache = container.resolve<AgentOutputCache>(ServiceKeys.CACHE);
    cache.cleanup(); // Clean up expired entries
  } catch (err) {
    // Cache might not be registered
  }

  logger.info('Application shutdown complete');
}

// Auto-initialize if not in test environment
if (import.meta.env.MODE !== 'test') {
  initializeApplication();
}
