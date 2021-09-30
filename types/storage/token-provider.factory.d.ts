import { StorageType, TokenProvider } from './storage.type';
/**
 * 토큰 제공자를 생성하여 가져온다.
 *
 * @param type 사용할 스토리지 타입
 * @param key 보관에 기준이되는 키
 */
export declare function createTokenProvider(type: StorageType, key: string): TokenProvider;
