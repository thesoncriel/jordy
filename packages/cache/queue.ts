/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncQueue } from '../util/AsyncQueue';

/**
 * 비동기 함수에 Queue 기능을 추가한다.
 *
 * Queue 가 적용되었을 때 해당 함수가 어딘가에서 수행중(pending)일 때 그 외 다른 곳에서 호출하면
 *
 * 기다렸다가 첫 호출 응답(성공 or 실패)이 오면, 추가 호출한 순서대로 응답(성공 or 실패)을 연속적으로 내어준다.
 *
 * 주의: 매 호출마다 파라미터가 다를 수 있다면 사용에 주의 할 것.
 *
 * @example
 * async function fetcher(name: string, age: number) {
 *   return timeout(1000, { name, age: age });
 * }
 * const queuedFetcher = queue(fetcher);
 *
 * const res0 = queuedFetcher('jordy', 10);
 * const res1 = queuedFetcher('theson', 20);
 * const res2 = queuedFetcher('lookpin', 30);
 *
 * const result = await Promise.all([res0, res1, res2]);
 *
 * console.log(result);
 * // [{ name: 'jordy', age: 10 }, { name: 'jordy', age: 10 }, { name: 'jordy', age: 10 }]
 *
 * @param fn Queue 기능을 추가 할 비동기 함수
 * @returns
 * @see {AsyncQueue}
 */
export function queue<FN extends (...args: any[]) => Promise<any>>(fn: FN): FN {
  const asyncQueue = createAsyncQueue();
  let pending = false;

  const resultFetcher = async function (...args: any[]) {
    if (pending) {
      return asyncQueue.awaiting();
    }

    pending = true;

    try {
      const response = await fn.apply(fn, args);

      if (asyncQueue.has()) {
        setTimeout(() => {
          asyncQueue.resolveAll(response);
        }, 10);
      }

      pending = false;

      return response;
    } catch (error) {
      if (asyncQueue.has()) {
        setTimeout(() => {
          asyncQueue.rejectAll(error);
        }, 10);
      }

      pending = false;

      throw error;
    }
  };

  return resultFetcher as FN;
}
