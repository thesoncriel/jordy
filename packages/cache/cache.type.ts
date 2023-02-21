import { StorageType } from 'packages/storage/storage.type';

export type LargeStorageType = Exclude<StorageType, 'cookie'>;

export interface CacheConfigDto<R, P> {
  /**
   * 캐시 고유키
   */
  key: string;
  /**
   * 캐시 종류 선택.
   *
   * @default 'session'
   */
  type?: LargeStorageType;
  /**
   * 캐시 유효기간 설정. (seconds)
   *
   * 0 혹은 설정하지 않으면 기한이 없다.
   *
   * @default 0
   */
  expired?: number;
  /**
   * 데이터 가져오기를 실제 수행 할 함수.
   */
  fetcher: (params: P) => Promise<R>;
}
