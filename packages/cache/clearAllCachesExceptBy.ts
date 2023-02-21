import { memoryStorage } from '../storage/memoryStorage';
import { StorageKeyManager } from '../storage/storage.type';
import { LargeStorageType } from './cache.type';

const findRelatedKeyCurried = (key: string) => (keyword: string) =>
  key.indexOf(keyword) >= 0;

function findAllKeysExcepts(sto: StorageKeyManager, keywords: string[]) {
  let key: string | null = null;
  const keyList: string[] = [];
  const len = sto.length;

  for (let keyIdx = 0; keyIdx < len; keyIdx++) {
    key = sto.key(keyIdx);

    if (key && !keywords.find(findRelatedKeyCurried(key))) {
      keyList.push(key);
    }
  }

  return keyList;
}

function getStorage(type: LargeStorageType): StorageKeyManager {
  if (type === 'session') {
    return sessionStorage;
  }
  if (type === 'local') {
    return localStorage;
  }

  return memoryStorage;
}

/**
 * 제시된 키워드가 포함되지 않은 캐시들을 모두 제거한다.
 *
 * @example
 * ```
 * clearAllCachesExceptBy(
 *   'local', // 로컬 스토리지 대상 예시
 *   ['jordy', 'theson', 'lookpin'], // 삭제 시 제외할 키워드들
 * );
 * ```
 *
 * @param type 지울 대상. local or session or memory
 * @param keywords 제외할 키워드
 * @param storageGetter 대상이되는 스토리지 함수. 테스트 용도가 아니면 별도로 지정하지 않음.
 * @returns 지워진 모든 캐시 개수
 *
 * @see clearCacheByKeyword - 지정된 키워드들에 한해서만 캐시를 지움.
 */
export function clearAllCachesExceptBy(
  type: LargeStorageType,
  keywords: string[],
  storageGetter = getStorage
) {
  const sto = storageGetter(type);
  const keyList = findAllKeysExcepts(sto, keywords);

  if (keyList.length === 0) {
    return 0;
  }

  for (let index = 0; index < keyList.length; index++) {
    sto.removeItem(keyList[index]);
  }

  return keyList.length;
}
