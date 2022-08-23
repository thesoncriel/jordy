/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromiseResolver } from '../types/etc.type';

/**
 * 다수의 비동기 응답 내용들을 Promise 로 캡슐화 하여 First-In First-Out 형태로 관리한다.
 */
export interface AsyncQueue<T, E = any> {
  /**
   * 곧바로 Promise 를 만들고 반환한다.
   *
   * 만들어진 Promise 의 resolve 와 reject 는 자동으로 queue 에 삽입된다.
   *
   * @params key 내부 Resolver 에 적용할 고유 키.
   */
  awaiting(key?: string | number): Promise<T>;
  /**
   * Promise 를 제어하는 resolver 를 queue 에 삽입한다.
   * @param resolver 삽입 할 resolver
   * @return 현재 요소 개수
   */
  enqueue(resolver: PromiseResolver<T, E>): number;
  /**
   * 삽입된 resolver 를 꺼낸다.
   *
   * 더이상 꺼낼 resolver 가 없으면 null 이다.
   */
  dequeue(): PromiseResolver<T, E> | null;
  /**
   * queue 내부에 resolver 가 1개 이상 존재하는지 여부를 확인한다.
   *
   * @return 있다면 true, 없다면 false
   */
  has(): boolean;
  /**
   * 삽입된 요소의 개수를 가져온다.
   */
  size(): number;
  /**
   * queue 내의 모든 resolver 에 resolve 명령을 내린 후 queue 를 비운다.
   * @param data 전달될 데이터
   * @param onEach resolve 될 때 수행된 resolver 의 key 와 적용되어 있던 index 를 확인하는 콜백
   * @return 수행된 개수
   */
  resolveAll(
    data: T,
    onEach?: (key: string | number | undefined, index: number) => void
  ): number;
  /**
   * queue 내의 모든 resolver 에 reject 명령을 내린 후 queue 를 비운다.
   * @param reason 전달될 에러 내용
   * @param onEach reject 될 때 수행된 resolver 의 key 와 적용되어 있던 index 를 확인하는 콜백
   * @return 수행된 개수
   */
  rejectAll(
    reason: E,
    onEach?: (key: string | number | undefined, index: number) => void
  ): number;
  /**
   * 모든 내부 요소에 reject 를 자동으로 수행 시킨 후 queue 를 비운다.
   */
  clear(): void;
}

class PromiseResolverQueue<T, E = any> implements AsyncQueue<T, E> {
  private elements: PromiseResolver<T, E>[] = [];

  awaiting(key?: string | number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.enqueue({
        key,
        resolve,
        reject,
      });
    });
  }
  enqueue(resolver: PromiseResolver<T, E>): number {
    this.elements.push(resolver);

    return this.elements.length;
  }
  dequeue(): PromiseResolver<T, E> | null {
    return this.elements.shift() || null;
  }
  has(): boolean {
    return this.elements.length > 0;
  }
  size(): number {
    return this.elements.length;
  }
  resolveAll(
    data: T,
    onEach?: (key: string | number | undefined, index: number) => void
  ): number {
    this.elements.forEach((resolver, index) => {
      resolver.resolve(data);
      onEach && onEach(resolver.key, index);
    });
    const size = this.elements.length;

    this.elements = [];

    return size;
  }
  rejectAll(
    reason: E,
    onEach?: (key: string | number | undefined, index: number) => void
  ): number {
    this.elements.forEach((resolver, index) => {
      resolver.reject(reason);
      onEach && onEach(resolver.key, index);
    });
    const size = this.elements.length;

    this.elements = [];

    return size;
  }
  clear() {
    this.rejectAll(
      new Error('AsyncQueue: All Requests are Rejected by clear.') as never
    );
  }
}

export function createAsyncQueue<T, E = any>(): AsyncQueue<T, E> {
  return new PromiseResolverQueue<T, E>();
}
