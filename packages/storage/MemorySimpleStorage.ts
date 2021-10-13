import { MarshallingType } from '../types';
import { SimpleStorage } from './storage.type';

const memoryCache: Record<string, MarshallingType> = {};
let memoryCacheKeys: string[] = [];
const MEMORY_CACHE_MAX = 100;

export class MemorySimpleStorage<T extends MarshallingType>
  implements SimpleStorage<T>
{
  constructor(readonly key: string) {}

  get(): T {
    return (memoryCache[this.key] || null) as T;
  }

  set(value: T): void {
    const { key } = this;

    if (memoryCacheKeys.length >= MEMORY_CACHE_MAX) {
      const oldKey = memoryCacheKeys.shift();

      if (oldKey) {
        delete memoryCache[oldKey];
      }
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!memoryCache.hasOwnProperty(key)) {
      memoryCacheKeys.push(key);
    }
    memoryCache[this.key] = value;
  }

  remove(): void {
    delete memoryCache[this.key];

    memoryCacheKeys = memoryCacheKeys.filter((key) => key !== this.key);
  }
}
