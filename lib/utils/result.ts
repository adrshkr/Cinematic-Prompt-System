// lib/utils/result.ts
/**
 * Result type for functional error handling
 * Inspired by Rust's Result<T, E> and functional programming patterns
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly ok = true;
  readonly error = false;

  constructor(public readonly value: T) {}

  isOk(): this is Success<T> {
    return true;
  }

  isError(): this is Failure<never> {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.value));
  }

  mapError<F>(_fn: (error: never) => F): Result<T, F> {
    return this as any;
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  match<U>(patterns: { ok: (value: T) => U; error: (error: never) => U }): U {
    return patterns.ok(this.value);
  }
}

export class Failure<E> {
  readonly ok = false;
  readonly error = true;

  constructor(public readonly value: E) {}

  isOk(): this is Success<never> {
    return false;
  }

  isError(): this is Failure<E> {
    return true;
  }

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as any;
  }

  mapError<F>(fn: (error: E) => F): Result<never, F> {
    return new Failure(fn(this.value));
  }

  flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E | F> {
    return this as any;
  }

  unwrap(): never {
    throw this.value;
  }

  unwrapOr<T>(defaultValue: T): T {
    return defaultValue;
  }

  match<U>(patterns: { ok: (value: never) => U; error: (error: E) => U }): U {
    return patterns.error(this.value);
  }
}

// Factory functions
export function Ok<T>(value: T): Success<T> {
  return new Success(value);
}

export function Err<E>(error: E): Failure<E> {
  return new Failure(error);
}

// Utility functions
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(error as Error);
  }
}

export async function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return Ok(value);
  } catch (error) {
    return Err(error as Error);
  }
}

// Collect results from an array
export function collect<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];

  for (const result of results) {
    if (result.isError()) {
      return result as unknown as Result<T[], E>;
    }
    values.push(result.value);
  }

  return Ok(values);
}

// Wait for all promises and collect results
export async function collectAsync<T, E>(
  promises: Promise<Result<T, E>>[]
): Promise<Result<T[], E>> {
  const results = await Promise.all(promises);
  return collect(results);
}

// Find first error or return all successes
export function collectAllErrors<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
  const values: T[] = [];
  const errors: E[] = [];

  for (const result of results) {
    if (result.isOk()) {
      values.push(result.value);
    } else {
      errors.push(result.value);
    }
  }

  if (errors.length > 0) {
    return Err(errors);
  }

  return Ok(values);
}

// Example usage types
export type AgentResult<T> = Result<T, AgentError>;

export interface AgentError {
  agentName: string;
  message: string;
  cause?: Error;
  retryable: boolean;
  timestamp: number;
}

export function createAgentError(
  agentName: string,
  message: string,
  cause?: Error,
  retryable = false
): AgentError {
  return {
    agentName,
    message,
    cause,
    retryable,
    timestamp: Date.now(),
  };
}
