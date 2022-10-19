/* eslint-disable @typescript-eslint/no-explicit-any */
import equalFn from 'fast-deep-equal/es6';

interface MemoizeFunction<T> {
  (data: T): T;
  clear(): void;
}

/**
 * 주어진 배열내 특정 2가지 요소에 대하여 서로 순서를 뒤바꾼다.
 *
 * sortable ui 결과를 이용할 때 쓰인다.
 * @param list
 * @param startIndex
 * @param endIndex
 * @returns
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * 주어진 배열의 특정 인덱스에 대하여 제시된 아이템 내용으로 업데이트한다.
 * @param list
 * @param index
 * @param item
 * @returns
 */
export function update<T>(list: T[], index: number, item: T) {
  const copied = [...list];

  copied[index] = item;

  return copied;
}

/**
 * 주어진 배열에서 특정 인덱스의 아이템을 삭제한다.
 * @param list
 * @param index
 * @returns
 */
export function remove<T>(list: T[], index: number) {
  const copied = [...list];

  copied.splice(index, 1);

  return copied;
}

/**
 * 특정 객체에 제시되는 키 값이 실제 키로 쓰이는지를 검사한다.
 * @param obj 확인 할 객체
 * @param key 확인 할 키값
 * @returns
 */
export function hasOwn<T extends Record<string | number | symbol, any>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 두 객체가 가진 필드값을 직접 비교한다.
 *
 * @see https://github.com/epoberezkin/fast-deep-equal
 */
export const deepEqual = equalFn;

/**
 * 특정 데이터에 대하여 깊은 비교(deep equality)를 활용하는 메모이즈 함수를 만든다.
 *
 * @example
 * interface SampleDto {
 *   name: string;
 *   age: number;
 * }
 *
 * const memoize = createMemoize<SampleDto>();
 * const prev: SampleDto = { name: '룩핀', age: 10 };
 * const next: SampleDto = { name: '룩핀', age: 10 };
 *
 * // next 와 prev 는 서로 다른 인스턴스 이므로 다르다.
 * console.log(prev === next); // false
 *
 * const first = memoize(prev);
 *
 * console.log(first === prev); // true
 *
 * const second = memoize(next);
 *
 * // next 값이 prev 값과 완전 동일하므로 이전값을 대신 반환한다.
 * console.log(second === next); // false
 * console.log(second === prev); // true
 *
 * const third = memoize({ name: '룩핀만세', age: 7 });
 *
 * // 새로운 값은 이전과 동일하지 않으므로 새로운 값을 대신 반환한다.
 * console.log(third === prev); // false
 * console.log(third); // { name: '룩핀만세', age: 7 }
 *
 * @returns 메모이즈 함수
 *
 * @see https://github.com/epoberezkin/fast-deep-equal
 */
export function createMemoize<T>(): MemoizeFunction<T> {
  let prevData: T | null = null;

  const fn = function memorize(data: T) {
    if (!prevData) {
      prevData = data;

      return data;
    }

    if (deepEqual(prevData, data)) {
      return prevData;
    }

    prevData = data;

    return data;
  };

  fn.clear = () => {
    prevData = null;
  };

  return fn;
}
