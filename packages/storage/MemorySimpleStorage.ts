import { MarshallingType } from '../types/marshalling.type';
import { SimpleStorage } from './storage.type';
import { memoryStorage } from './memoryStorage';

export class MemorySimpleStorage<T extends MarshallingType>
  implements SimpleStorage<T>
{
  private storage = memoryStorage;
  constructor(readonly key: string) {}

  get(): T {
    return (this.storage.getItem(this.key) || null) as T;
  }

  set(value: T): void {
    this.storage.setItem(this.key, value);
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }
}
