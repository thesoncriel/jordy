import { createStorage } from './storage.factory';
import { StorageType, TokenProvider } from './storage.type';
import { StorageTokenProvider } from './StorageTokenProvider';

/**
 * 토큰 제공자를 생성하여 가져온다.
 *
 * @param type 사용할 스토리지 타입
 * @param key 보관에 기준이되는 키
 * @param expiredTime 유효시간 (seconds). 시간을 주지 않거나 0보다 작다면 자료 유효시간이 없다. 기본값은 0.
 */
export function createTokenProvider(
  type: StorageType,
  key: string,
  expiredTime?: number
): TokenProvider {
  return new StorageTokenProvider(
    createStorage<string>(type, key, expiredTime)
  );
}
