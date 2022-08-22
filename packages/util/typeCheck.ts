export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined';
}

export function isString(val: unknown): val is string {
  return Object.prototype.toString.call(val) === '[object String]';
}

/**
 * 값이 undefined 이거나 null 인지 여부를 확인한다.
 *
 * 그리고 내용이 문자열 'undefined' 나 'null' 인지도 판단한다.
 * @param val 확인 할 값.
 */
export function isNullable(val: unknown): val is void {
  return (
    isUndefined(val) || val === null || val === 'undefined' || val === 'null'
  );
}

/**
 * @deprecated 삭제 예정
 *
 * 들어온 값이 빈 배열인지 확인한다.
 * @param val
 */
export function isEmptyArray(val: unknown) {
  return !Array.isArray(val) || val.length === 0;
}

/**
 * 값이 숫자인지 확인한다.
 * @param val
 */
export function isNumber(val: unknown): val is number {
  return Object.prototype.toString.call(val) === '[object Number]';
}

/**
 * 순수 숫자인지 아니면 문자열로 된 숫자인지 확인한다.
 * @param val
 */
export function isNumberLike(val: unknown) {
  if (isNumber(val)) {
    return true;
  }
  if (isString(val)) {
    return /^[0-9]+$/.test(val);
  }
  return false;
}

/**
 * 주어진 값이 빈 객체인지 여부를 확인한다.
 * @param val
 * @returns
 */
export function isEmptyObject(val: unknown): val is Record<string, never> {
  try {
    return (
      val &&
      isObject(val) &&
      Object.keys(val).length === 0 &&
      val.constructor === Object
    );
  } catch (error) {
    return false;
  }
}

/**
 * 호출 가능한 함수인지 여부를 확인한다.
 * @param val
 * @returns
 */
export function isFunction(val: unknown): val is CallableFunction {
  return Object.prototype.toString.call(val) === '[object Function]';
}

/**
 * 객체인지 확인한다.
 * @param val
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(val: unknown): val is Object {
  return Object.prototype.toString.call(val) === '[object Object]';
}
