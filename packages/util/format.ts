import { isNumber } from './typeCheck';

/**
 * 숫자값을 3자리마다 쉼표가 찍힌 문자열로 바꿔준다.
 * @param value 바꿀 숫자.
 * @param def 값이 없을 때 기본 출력될 값.
 */
export function numberFormat(value: number, def = '0') {
  if (!value || !isNumber(value)) {
    return def;
  }
  return value.toLocaleString();
}
