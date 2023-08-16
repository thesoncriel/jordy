import { CookieService, SimpleStorage } from './storage.type';
import { marshalJson, unmarshalJson } from '../util/json';
import { MarshallingType } from '../types/marshalling.type';

export class CookieStorageAdapter<T extends MarshallingType>
  implements SimpleStorage<T>
{
  constructor(
    private cookie: CookieService,
    readonly key: string,
    public expiredTime = 0
  ) {}

  get(): T | null {
    return unmarshalJson(this.cookie.get(this.key)) as T | null;
  }

  set(value: T): void {
    this.cookie.set(this.key, marshalJson(value), this.expiredTime);
  }

  remove(): void {
    this.cookie.remove(this.key);
  }
}
