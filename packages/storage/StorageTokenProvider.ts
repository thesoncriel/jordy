import { TokenProvider, SimpleStorage } from './storage.type';

/**
 * 토큰을 로컬 스토리지에 보관하며 제공한다.
 */
export class StorageTokenProvider implements TokenProvider {
  constructor(private storage: SimpleStorage<string>) {}

  get() {
    return this.storage.get() || '';
  }

  set(token: string, expiredDate?: string): void {
    this.storage.set(token, expiredDate);
  }

  clear(): void {
    this.storage.remove();
  }
}
