import { createStorage } from '../storage/createStorage.factory';
import { CacheConfigDto, CachedAsyncFunction } from './cache.type';
import { clearCacheByKeyword } from './clearCacheByKeyword';
import { createCacheKey } from './createCacheKey';

/**
 * 데이터를 가져오는 비동기 함수에 대해 그 결과값을 일정시간동안 캐싱하는 비동기 함수를 만든다.
 *
 * @example
 * ```
 * // 선언
 * const cachedFetchJordyDashboard = cache({
 *   key: 'jordy_dashboard',
 *   type: 'memory',
 *   expired: 60 * 3,
 *   fetcher: repo.jordy.fetchDashboard,
 * });
 *
 * // 사용
 * async function main() {
 *   const params = { date: Date.now(), page: 1 };
 *   const result = await cachedFetchJordyDashboard(params);
 *
 *   console.log(result);
 * }
 * ```
 *
 * @param {CacheConfigDto} config 캐시 설정
 * @returns 캐시 기능이 적용된 비동기 함수
 */
export function cache<R, P = void>({
  key,
  type = 'session',
  expired,
  fetcher,
}: CacheConfigDto<R, P>): CachedAsyncFunction<R, P> {
  const resultFetcher = async function fetcherProxy(params: P) {
    const sto = createStorage<R>(type, createCacheKey(key, params), expired);

    const cachedData = sto.get();

    if (cachedData) {
      return cachedData;
    }

    const newResult = await fetcher(params);

    sto.set(newResult);

    return newResult;
  };

  resultFetcher.clear = () => clearCacheByKeyword(type, key);

  return resultFetcher;
}
