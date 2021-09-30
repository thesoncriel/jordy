import { SimpleStorage, StorageType } from './storage.type';
import { MarshalableType } from '../types';
/**
 * 캐시용 스토리지를 만드는 빌더.
 * Memory, Local, Session 3가지로 만들 수 있다.
 * 사용 시 type, key 가 필요하다.
 *
 * 만약 서버 환경이거나 스토리지를 이용 할 수 없을 경우, type 은 memory 로 강제된다.
 *
 * @example
 * interface SampleModel {
 *   name: string;
 *   age: number;
 * }
 * const sto = storageFactory<SampleModel>('local', 'sampleKey');
 * const data: SampleModel = {
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
 * @param type 스토리지 타입. session, local, memory 중 하나. 기본 session.
 * @param key 스토리지에서 쓰이는 키. 기본값은 '_' (underbar).
 * @param expiredTime 유효시간 (seconds). 시간을 주지 않거나 0보다 작다면 자료 유효시간이 없다. 기본값은 0.
 */
export declare const createStorage: <T extends MarshalableType>(type?: StorageType, key?: string, expiredTime?: number) => SimpleStorage<T>;
