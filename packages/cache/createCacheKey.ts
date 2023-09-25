import { isNumber, isObject, isString } from '../util/typeCheck';

/**
 * 키와 파라미터를 조합하여 키값을 만든다.
 *
 * 이 함수는 각종 캐시 제어 기능에 쓰인다.
 *
 * @param key 기반이 되는 키값
 * @param params 조합될 1차 파라미터값. 객체일 경우 그 키와 값을 직렬화 하여 사용, 아닐경우 그 값 자체로 사용.
 * @param subKeys params 에서 사용될 키를 지정한다. 미 지정 시 params 의 모든 키를 대상으로 키값을 만든다.
 * @returns
 */
export function createCacheKey<P>(
  key: string,
  params?: P,
  subKeys?: Array<keyof P>
): string {
  if (Array.isArray(params)) {
    return `${key}-${params.join(',')}`;
  }

  if (isObject(params)) {
    let appendedValues: string[];

    if (subKeys) {
      appendedValues = subKeys.reduce(
        (acc, currKey) => {
          acc.push(
            createCacheKey(currKey as string, params[currKey as keyof P])
          );

          return acc;
        },
        [key]
      );
    } else {
      appendedValues = Object.entries(params).reduce(
        (acc, item) => {
          acc.push(createCacheKey(item[0], item[1]));

          return acc;
        },
        [key]
      );
    }

    return appendedValues.join('-');
  }

  if (params && (isString(params) || isNumber(params))) {
    return `${key}-${params}`;
  }
  return key;
}
