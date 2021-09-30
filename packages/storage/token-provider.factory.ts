import { SimpleStorage, StorageType, TokenProvider } from './storage.type';
import { createStorage } from './storage.factory';
/**
 * 토큰을 로컬 스토리지에 보관하며 제공한다.
 */
class StorageTokenProvider implements TokenProvider {
  private _token = '';

  constructor(private storage: SimpleStorage<string>) {
    this._token = this.storage.get() || '';
  }

  get() {
    // TODO: 이 후 토큰 제공자로 모든 토큰 관리를 하게되면 아래 코드로 되돌릴 것 - theson
    // return this._token;
    return this.storage.get() || '';
  }

  set(token: string): void {
    this._token = token;
    this.storage.set(token);
  }

  clear(): void {
    this._token = '';
    this.storage.remove();
  }
}
/**
 * 토큰 제공자를 생성하여 가져온다.
 *
 * @param type 사용할 스토리지 타입
 * @param key 보관에 기준이되는 키
 */
export function createTokenProvider(
  type: StorageType,
  key: string
): TokenProvider {
  return new StorageTokenProvider(createStorage<string>(type, key));
}
