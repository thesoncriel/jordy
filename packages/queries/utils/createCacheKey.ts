import { isNumber, isObject, isString } from '../../util';

export function createCacheKey<P>(
  key: string,
  params?: P,
  subKeys?: Array<keyof P>
): string {
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
