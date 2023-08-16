import { CookieStorageAdapter } from './CookieStorageAdapter';
import {
  ExpiableStorageUiState,
  SimpleStorage,
  StorageType,
} from './storage.type';
import { ExpiableStorageAdapter } from './ExpiableStorageAdapter';
import { MemorySimpleStorage } from './MemorySimpleStorage';
import { SimpleStorageAdapter } from './SimpleStorageAdapter';
import { cookie } from './cookie';
import { isServer, isStorageAvailable } from '../util/envCheck';
import { MarshallingType } from '../types/marshalling.type';

/**
 * 캐시용 스토리지를 만드는 팩토리.
 * Memory, Local, Session 3가지로 만들 수 있다.
 * 사용 시 type, key 가 필요하다.
 *
 * 만약 서버 환경이거나 스토리지를 이용 할 수 없을 경우, type 은 memory 로 강제된다.
 *
 * @example
 * interface SampleUiState {
 *   name: string;
 *   age: number;
 * }
 * const sto = storageFactory<SampleUiState>('local', 'sampleKey');
 * const data: SampleUiState = {
 *   name: '포메포메',
 *   age: 3,
 * };
 *
 * sto.set(data); // 스토리지에 데이터 설정
 *
 * const result = sto.get(); // 스토리지에서 데이터 가져오기
 *
 * sto.remove(); // 스토리지에서 데이터 삭제
 *
 * @param type 스토리지 타입. session, local, memory 중 하나.
 * @param key 스토리지에서 쓰이는 키.
 * @param expiredTime 유효시간 (seconds). 시간을 주지 않거나 0보다 작다면 자료 유효시간이 없다. 기본값은 0.
 */
export const createStorage = <T extends MarshallingType>(
  type: StorageType,
  key: string,
  expiredTime = 0
): SimpleStorage<T> => {
  let ret: SimpleStorage<T>;

  if (type !== 'cookie' && expiredTime > 0) {
    return new ExpiableStorageAdapter<T>(
      createStorage<ExpiableStorageUiState<T>>(type, key),
      expiredTime
    );
  }

  if (isServer() || !isStorageAvailable() || type === 'memory') {
    ret = new MemorySimpleStorage<T>(key);
  } else if (type === 'cookie') {
    ret = new CookieStorageAdapter<T>(cookie, key, expiredTime);
  } else {
    try {
      ret = new SimpleStorageAdapter<T>(
        key,
        type === 'local' ? localStorage : sessionStorage
      );
    } catch (error) {
      ret = new MemorySimpleStorage<T>(key);
    }
  }

  return ret;
};
