import type { Store } from 'cache-manager';

export interface AppCache extends Store {
  set: <T>(key: string, value: T, options?: { ttl?: number }) => Promise<void>;
  get: <T>(key: string) => Promise<T | undefined>;
  del: (key: string) => Promise<void>;

  keys?: (pattern: string) => Promise<string[]>;
}
