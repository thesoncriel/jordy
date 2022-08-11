import {
  memoryStorage,
  StorageKeyManager,
  StorageType,
} from 'packages/storage';

type LargeStorageType = Exclude<StorageType, 'cookie'>;

function getStorage(type: LargeStorageType): StorageKeyManager {
  if (type === 'session') {
    return sessionStorage;
  }
  if (type === 'local') {
    return localStorage;
  }

  return memoryStorage;
}

const findRelatedKeyCurried = (key: string) => (keyword: string) =>
  key.indexOf(keyword) >= 0;

function findAllRelatedKeyFromStorage(
  sto: StorageKeyManager,
  keyword: string | string[]
) {
  let key: string | null = null;
  const keyList: string[] = [];
  const len = sto.length;

  if (len === 0) {
    return keyList;
  }

  if (Array.isArray(keyword)) {
    for (let keyIdx = 0; keyIdx < len; keyIdx++) {
      key = sto.key(keyIdx);

      if (key && keyword.find(findRelatedKeyCurried(key))) {
        keyList.push(key);
      }
    }
  } else {
    for (let keyIdx = 0; keyIdx < len; keyIdx++) {
      key = sto.key(keyIdx);

      if (key && key.indexOf(keyword) >= 0) {
        keyList.push(key);
      }
    }
  }
  return keyList;
}

/**
 * 캐시를 제거한다.
 *
 * 제공되는 cache 디코레이터로 만들어진 캐시들을 제거하는데 쓰인다.
 *
 * @param type 캐시 타입 (쿠키 제외)
 * @param keyword 삭제 대상이 되는 키워드
 * @returns
 */
export function clearCacheByKeyword(
  type: LargeStorageType,
  keyword: string | string[],
  storageGetter = getStorage
) {
  const sto = storageGetter(type);
  const keyList = findAllRelatedKeyFromStorage(sto, keyword);

  if (keyList.length === 0) {
    return 0;
  }

  for (let index = 0; index < keyList.length; index++) {
    sto.removeItem(keyList[index]);
  }

  return keyList.length;
}
