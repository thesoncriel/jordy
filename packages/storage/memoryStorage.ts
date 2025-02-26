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
      if (this.cacheMap.size >= 50) {
        const oldestKey = this.keys.shift();

        this.cacheMap.delete(oldestKey);
      }
      this.keys.push(key);
    }
    this.cacheMap.set(key, value);
  }
}

/**
 * 메모리 스토리지 인스턴스.
 *
 * MemorySimpleStorage 에서 쓰인다.
 */
export const memoryStorage: MemoryStorage = new MemoryStorageImpl();
