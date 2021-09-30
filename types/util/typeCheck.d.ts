export declare function isUndefined(val: unknown): val is undefined;
export declare function isString(val: unknown): val is string;
/**
 * 값이 undefined 이거나 null 인지 여부를 확인한다.
 *
 * 그리고 내용이 문자열 'undefined' 나 'null' 인지도 판단한다.
 * @param val 확인 할 값.
 */
export declare function isNullable(val: unknown): val is void;
/**
 * 들어온 값이 빈 배열인지 확인한다.
 * @param val
 */
export declare function isEmptyArray(val: unknown): boolean;
/**
 * 값이 숫자인지 확인한다.
 * @param val
 */
export declare function isNumber(val: unknown): val is number;
/**
 * 순수 숫자인지 아니면 문자열로 된 숫자인지 확인한다.
 * @param val
 */
export declare function isNumberLike(val: unknown): boolean;
export declare function isEmptyObject(obj: Record<string, unknown>): boolean;
/**
 * 호출 가능한 함수인지 여부를 확인한다.
 * @param val
 * @returns
 */
export declare function isFunction(val: unknown): val is CallableFunction;
/**
 * 객체인지 확인한다.
 * @param val
 * @returns
 */
export declare function isObject(val: unknown): val is Object;
