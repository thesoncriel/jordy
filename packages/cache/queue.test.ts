/* eslint-disable @typescript-eslint/no-explicit-any */
import { noop } from '../util/etc';
import { queue } from './queue';
import { PromiseResolver } from '../types/etc.type';

function passthrough(middleFn: () => void) {
  return <T>(value: T): T => {
    middleFn();

    return value;
  };
}

function throwCatch(middleFn: () => void) {
  return (error: any) => {
    middleFn();

    return Promise.reject(error);
  };
}

describe('queue', () => {
  const MOCK_DATA = 1234;
  const resolver: PromiseResolver<never> = {
    resolve: noop,
    reject: noop,
  };
  const mockFn = vi.fn((..._args: number[]) => {
    return new Promise((resolve, reject) => {
      resolver.resolve = resolve;
      resolver.reject = reject;
    });
  });

  beforeEach(() => {
    mockFn.mockClear();
  });

  it('비동기 함수를 순간 여럿 수행하면 그 순서대로 응답을 받을 수 있다.', async () => {
    const queuedFn = queue(mockFn);
    const seqList: number[] = [];

    const fnList = [
      queuedFn(1, 2, 3).then(passthrough(() => seqList.push(1))),
      queuedFn(1, 2, 3).then(passthrough(() => seqList.push(2))),
      queuedFn(1, 2, 3).then(passthrough(() => seqList.push(3))),
    ];

    setTimeout(() => {
      resolver.resolve(MOCK_DATA as never);
    }, 5);

    const results = await Promise.all(fnList);

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith(1, 2, 3);
    expect(results).toEqual(seqList.map(() => MOCK_DATA));
    expect(seqList).toEqual([1, 2, 3]);
  });

  it('첫 응답이 오기 전까지 이 후 요청되는 파라미터들은 무시되고 첫 요청 파라미터만 반영된다.', async () => {
    const queuedFn = queue(mockFn);
    const seqList: number[] = [];

    const fnList = [
      // 첫 요청 파라미터만 유효하다.
      queuedFn(100, 200, 300).then(passthrough(() => seqList.push(1))),
      // 이후 요청 파라미터는 무시한다.
      queuedFn(4, 5, 6).then(passthrough(() => seqList.push(2))),
      queuedFn(7, 8, 9).then(passthrough(() => seqList.push(3))),
      queuedFn(10, 11, 12).then(passthrough(() => seqList.push(4))),
      queuedFn(13, 14, 15).then(passthrough(() => seqList.push(5))),
    ];

    setTimeout(() => {
      resolver.resolve(MOCK_DATA as never);
    }, 5);

    const results = await Promise.all(fnList);

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith(100, 200, 300);
    // 응답 값은 모든 요청에 대해 동일하며 그 값은 첫 요청에 의한 것이다.
    expect(results).toEqual(seqList.map(() => MOCK_DATA));
    expect(seqList).toEqual([1, 2, 3, 4, 5]);
  });

  it('비동기 함수를 끊어서 여럿 수행하면 그 순서대로 응답을 받을 수 있다.', async () => {
    const queuedFn = queue(mockFn);
    const seqList: number[] = [];

    const fnList0 = [
      queuedFn(4, 5, 6).then(passthrough(() => seqList.push(1))),
      queuedFn(4, 5, 6).then(passthrough(() => seqList.push(2))),
      queuedFn(4, 5, 6).then(passthrough(() => seqList.push(3))),
    ];

    setTimeout(() => {
      resolver.resolve(MOCK_DATA as never);
    }, 5);

    const results0 = await Promise.all(fnList0);

    expect(mockFn).toBeCalledWith(4, 5, 6);
    expect(results0).toEqual(fnList0.map(() => MOCK_DATA));

    const fnList1 = [
      queuedFn(9, 90, 900).then(passthrough(() => seqList.push(10))),
      queuedFn(9, 90, 900).then(passthrough(() => seqList.push(11))),
      queuedFn(9, 90, 900).then(passthrough(() => seqList.push(12))),
      queuedFn(9, 90, 900).then(passthrough(() => seqList.push(13))),
    ];

    setTimeout(() => {
      resolver.resolve(2023 as never);
    }, 5);

    const results1 = await Promise.all(fnList1);

    expect(mockFn).toBeCalledWith(9, 90, 900);
    expect(results1).toEqual(fnList1.map(() => 2023));

    expect(mockFn).toBeCalledTimes(2);
    expect(seqList).toEqual([1, 2, 3, 10, 11, 12, 13]);
  });

  it('여럿 수행한 결과가 실패면 그 순서대로 사유를 받을 수 있다.', async () => {
    const error = {
      name: 'error',
      message: 'lookpin!',
    };

    const queuedFn = queue(mockFn);
    const seqList: number[] = [];

    const fnList = [
      queuedFn(1, 2, 3).catch(throwCatch(() => seqList.push(1))),
      queuedFn(1, 2, 3).catch(throwCatch(() => seqList.push(2))),
      queuedFn(1, 2, 3).catch(throwCatch(() => seqList.push(3))),
      queuedFn(1, 2, 3).catch(throwCatch(() => seqList.push(4))),
      queuedFn(1, 2, 3).catch(throwCatch(() => seqList.push(5))),
    ];

    setTimeout(() => {
      resolver.reject(error);
    }, 5);

    const results = await Promise.allSettled(fnList).then((data) =>
      data.map((datum) => (datum as PromiseRejectedResult).reason)
    );

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith(1, 2, 3);

    expect(results).toEqual(fnList.map(() => error));
    expect(seqList).toEqual([1, 2, 3, 4, 5]);
  });
});
