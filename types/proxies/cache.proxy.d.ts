import { HttpApi } from '../http-api';
declare type CacheProxy = (baseApi: HttpApi) => <T extends string | string[] | Record<string, any>, P = void | Record<string, any>>(url: string, params?: P) => Promise<T>;
declare type CacheType = 'local' | 'session' | 'memory';
/**
 * 스토리지를 이용한 API 캐시를 적용한다.
 *
 * @param type local, session, memory 셋 중 하나. 기본 local.
 * @param expiredTime 캐시가 만료되는 시간(seconds). 0 이하면 무제한. 기본 0.
 */
export declare function cache(type?: CacheType, expiredTime?: number): CacheProxy;
export {};
