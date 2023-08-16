import { MarshallingType } from '../types/marshalling.type';
import { marshalJson, unmarshalJson } from '../util/json';
import { SimpleStorage } from './storage.type';

export class SimpleStorageAdapter<T extends MarshallingType>
  implements SimpleStorage<T>
{
  constructor(readonly key: string, private storage: Storage) {}

  get(): T {
    return unmarshalJson(this.storage.getItem(this.key)) as T;
  }

  set(value: T): void {
    this.storage.setItem(this.key, marshalJson(value));
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }
}
