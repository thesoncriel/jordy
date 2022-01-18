/* eslint-disable @typescript-eslint/no-explicit-any */

import { StorageKeyManager } from './storage.type';

interface MemoryStorage extends StorageKeyManager {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
}

class MemoryStorageImpl implements MemoryStorage {
  private cacheMap = new Map<string, any>();
  private keys: string[] = [];

  get length(): number {
    return this.cacheMap.size;
  }
  clear(): void {
    this.cacheMap.clear();
    this.keys = [];
  }
  getItem(key: string): any {
    return this.cacheMap.get(key);
  }
  key(index: number): string | null {
    return this.keys[index] || null;
  }
  removeItem(key: string): void {
    this.cacheMap.delete(key);
    this.keys = this.keys.filter((item) => item !== key);
  }
  setItem(key: string, value: any): void {
    if (this.cacheMap.has(key) === false) {
      this.keys.push(key);
    }
    this.cacheMap.set(key, value);
  }
}

export const memoryStorage: MemoryStorage = new MemoryStorageImpl();
