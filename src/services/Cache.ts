/**
 * Cache Service
 * This service provides a simple in-memory cache implementation
 * for storing and retrieving key-value pairs.
 */

export interface CacheOptions {
  override?: boolean;
  debug?: boolean;
}

export type CacheValue = Record<string, unknown>;

export class Cache {
  options: CacheOptions;
  cache: Map<string, CacheValue>;

  /**
   * Constructor for the Cache service.
   * @param options - Configuration options for the cache
   */
  constructor(options: CacheOptions = { override: false, debug: true }) {
    this.options = options;
    this.cache = new Map();
  }

  /**
   * Retrieve the value associated with a given key.
   * @param key - The key to look up in the cache
   * @returns The value associated with the key
   * @throws {Error} If the key does not exist in the cache
   */
  get(key: string): CacheValue {
    const value = this.cache.get(key);
    if (value === undefined && !this.cache.has(key)) {
      throw new Error("Key not found");
    }

    return value as CacheValue;
  }

  /**
   * Create a new key with associated data.
   * @param data - The data to associate with the new key
   * @param key - Optional custom key; if not provided, a timestamp will be used
   * @returns A unique identifier for the created cache entry
   */
  create(data: CacheValue, key: string = Date.now().toString()): string {
    this.log(`Creating key: ${key}`, data);

    if (this.cache.has(key)) {
      if (this.options.override) {
        this.log(`Key ${key} already exists, overriding.`);
        const existingData = this.cache.get(key);
        this.cache.set(key, {
          ...existingData,
          ...data,
        });
      } else {
        this.log("Overriding is disabled in options.");
        this.log(`Key ${key} already exists, not overriding.`);
        throw new Error("Key already in use");
      }
    } else {
      this.cache.set(key, data);
    }

    this.logTable(Array.from(this.values));

    return key;
  }

  /**
   * Update an existing key with new data.
   * @param key - The key to update
   * @param data - The new data to associate with the key
   * @returns An object containing the key and updated data
   */
  update(key: string, data: CacheValue): { key: string; data: CacheValue } {
    if (!this.cache.has(key)) {
      throw new Error("Key not found");
    }

    const existingData = this.cache.get(key);
    const newData = { ...existingData, ...data };

    this.cache.set(key, newData);

    this.log(`Overriding ${key}`, data);
    this.logTable(Array.from(this.cache.entries()));

    return { key, data: newData };
  }

  /**
   * Remove a key and its associated data from the cache.
   * @param key - The key to remove
   * @throws {Error} If the key does not exist in the cache
   */
  remove(key: string): void {
    if (!this.cache.delete(key)) {
      throw new Error("Key not found");
    }
  }

  /**
   * Retrieve all keys currently stored in the cache.
   * @returns An array of all keys in the cache
   */
  get keys(): string[] {
    return Array.from(this.cache.keys()); // Eqivalent to [...this.cache.keys()]
  }

  /**
   * Retrieve all values currently stored in the cache.
   * @returns An array of all values in the cache
   */
  get values(): CacheValue[] {
    return Array.from(this.cache.values()); // Equivalent to [...this.cache.values()]
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.clear();
    this.log("Cache cleared");
  }

  /**
   * Log a message to the console if debugging is enabled.
   * @param message - The message to log
   * @param data - Additional arguments to log
   */
  log(message: string, data?: unknown): void {
    if (this.options.debug) {
      if (data) {
        console.log(`[Cache] ${message}`, data);
      } else {
        console.log(`[Cache] ${message}`);
      }
    }
  }

  /**
   * Log a message as a table.
   * @param message
   */
  logTable(message: unknown): void {
    if (this.options.debug) {
      console.table(message);
    }
  }
}
