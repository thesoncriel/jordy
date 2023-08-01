import { MarshallingType } from '../types';

/**
 * 스토리지 타입
 * - local - 로컬 스토리지
 * - session - 세션 스토리지
 * - memory - 메모리 스토리지
 */
export type StorageType = 'local' | 'session' | 'memory' | 'cookie';

/**
 * 스토리지의 키를 관리한다.
 *
 * sessionStorage 와 localStorage, memoryStorage 의 공통기능 모음이다.
 */
export interface StorageKeyManager {
  /**
   * 스토리지가 가진 자료의 개수
   */
  readonly length: number;
  /**
   * 스토리지 내 모든 자료를 제거한다.
   */
  clear(): void;
  /**
   * 주어진 인덱스를 통해 스토리지의 키를 가져온다.
   * @param index
   */
  key(index: number): string | null;
  /**
   * 주어진 키로 저장된 자료를 제거한다.
   * @param key
   */
  removeItem(key: string): void;
}

/**
 * 간단한 스토리지를 구성할 때 쓰이는 인터페이스.
 *
 * 사용 가능한 타입은 string 이나 객체형이다.
 */
export interface SimpleStorage<T extends MarshallingType> {
  /**
   * 현재 스토리지가 사용하고 있는 키값.
   * get, set, remove 이용 시 지정된 키값을 자동으로 사용 한다.
   */
  readonly key: string;
  /**
   * 스토리지에서 값을 가져온다.
   */
  get(): T | null;
  /**
   * 스토리지에 값을 설정한다.
   * @param value 설정할 값
   * @param expiredDate 다시 설정 할 만료일자
   */
  set(value: T, expiredDate?: string): void;
  /**
   * 스토리지에 설정된 값을 지운다.
   */
  remove(): void;
}

/**
 * 유효기간이 있는 스토리지 데이터.
 */
export interface ExpiableStorageUiState<T> {
  /**
   * 최대 유효시간. Unix Time Stamp 값을 기준으로 기록한다.
   *
   * Date.prototype.getTime 값에 대응한다.
   */
  expiredTime: number;
  /**
   * 보관된 자료
   */
  data: T;
}

/**
 * 토큰을 제공한다.
 */
export interface TokenProvider {
  /**
   * 토큰 값을 가져 온다.
   */
  get(): string;
  /**
   * 토큰 값을 설정 한다.
   * @param token 토큰값
   * @param expiredDate 다시 설정 할 만료일자
   */
  set(token: string, expiredDate?: string): void;
  /**
   * 현재 토큰값을 지운다.
   */
  clear(): void;
}

export interface CookieService {
  get(key: string): string;
  set(key: string, value: string, expireDays?: number): void;
  remove(key: string): void;
}
