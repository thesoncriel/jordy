/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpApi } from '../http-api';
import { createStorage } from '../storage';
import { isServer } from '../util/envCheck';

/**
 * 테스트중 캐시 기능을 무력화 하고 싶을 때 true 로 바꿔서 쓸 것.
 */
const FORCE_NOT_CACHE = false;

type CacheProxy = (
  baseApi: HttpApi
) => <
  T extends string | string[] | Record<string, any>,
  P = void | Record<string, any>
>(
  url: string,
  params?: P
) => Promise<T>;

type CacheType = 'local' | 'session' | 'memory';

function createKey<P = void>(url: string, params?: P) {
  if (params) {
    return `${url}-${JSON.stringify(params)}`;
  }
  return url;
}

/**
 * 스토리지를 이용한 API 캐시를 적용한다.
 *
 * @param type local, session, memory 셋 중 하나. 기본 local.
 * @param expiredTime 캐시가 만료되는 시간(seconds). 0 이하면 무제한. 기본 0.
 */
export function cache(type?: CacheType, expiredTime = 0): CacheProxy {
  if (isServer() || FORCE_NOT_CACHE) {
    return (baseApi: HttpApi) =>
      // eslint-disable-next-line @typescript-eslint/unbound-method
      baseApi.get;
  }

  /**
   * 캐시 디코레이터. API 함수를 내포하여 대신 수행한다.
   * @param fn API 함수
   */
  const cacheProxy = function (
    fn: <T extends string | string[] | Record<string, any>, P = void>(
      url: string,
      params?: P
    ) => Promise<T>
  ) {
    return <T extends string | string[] | Record<string, any>, P = void>(
      url: string,
      params?: P
    ) => {
      const storage = createStorage<T>(
        type,
        createKey<P>(url, params),
        expiredTime
      );
      const value = storage.get();

      if (value) {
        return Promise.resolve(value);
      }

      return fn<T, P>(url, params).then((data) => {
        storage.set(data);

        return data;
      });
    };
  };

  return (baseApi: HttpApi) =>
    cacheProxy((...args) => baseApi.get.apply(baseApi, [...args]));
}
