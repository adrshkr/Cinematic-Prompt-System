// lib/infrastructure/logger.ts
/**
 * Structured logging infrastructure
 * Provides consistent, queryable logs across the entire system
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  agentName?: string;
  agentVersion?: string;
  projectId?: string;
  executionId?: string;
  duration?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private handlers: LogHandler[] = [];

  constructor() {
    // Default: Console handler
    this.addHandler(new ConsoleLogHandler());
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  addHandler(handler: LogHandler) {
    this.handlers.push(handler);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    this.handlers.forEach(handler => {
      try {
        handler.handle(entry);
      } catch (err) {
        // Fallback to console if handler fails
        console.error('Logger handler failed:', err);
      }
    });
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error) {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Agent-specific convenience methods
  agentStart(agentName: string, agentVersion: string, context?: LogContext) {
    this.info(`Agent started: ${agentName}`, {
      agentName,
      agentVersion,
      ...context,
    });
  }

  agentComplete(agentName: string, duration: number, context?: LogContext) {
    this.info(`Agent completed: ${agentName}`, {
      agentName,
      duration,
      ...context,
    });
  }

  agentError(agentName: string, error: Error, context?: LogContext) {
    this.error(`Agent failed: ${agentName}`, {
      agentName,
      ...context,
    }, error);
  }

  apiCall(method: string, duration: number, success: boolean, context?: LogContext) {
    this.info(`API call: ${method}`, {
      method,
      duration,
      success,
      ...context,
    });
  }
}

// Abstract handler interface
export interface LogHandler {
  handle(entry: LogEntry): void;
}

// Console handler (default)
class ConsoleLogHandler implements LogHandler {
  handle(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : '';

    const message = `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}${errorStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.error);
        break;
    }
  }
}

// Storage handler (for persisting logs)
export class StorageLogHandler implements LogHandler {
  private maxLogs = 1000;
  private storageKey = 'app_logs';

  handle(entry: LogEntry): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const logs: LogEntry[] = stored ? JSON.parse(stored) : [];

      logs.push(entry);

      // Keep only last N logs
      if (logs.length > this.maxLogs) {
        logs.shift();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (err) {
      // Ignore storage errors
    }
  }

  getLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem(this.storageKey);
  }
}

// Metrics handler (for collecting metrics)
export class MetricsHandler implements LogHandler {
  private metrics: Map<string, number[]> = new Map();

  handle(entry: LogEntry): void {
    if (entry.context?.duration) {
      const key = entry.context.agentName || 'unknown';
      const durations = this.metrics.get(key) || [];
      durations.push(entry.context.duration);
      this.metrics.set(key, durations);
    }
  }

  getMetrics(agentName: string) {
    const durations = this.metrics.get(agentName) || [];
    if (durations.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0 };
    }

    return {
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    this.metrics.forEach((durations, agentName) => {
      result[agentName] = this.getMetrics(agentName);
    });
    return result;
  }
}

// Singleton instance
export const logger = new Logger();

// Development mode: verbose logging
if (import.meta.env.DEV) {
  logger.setMinLevel(LogLevel.DEBUG);
}
