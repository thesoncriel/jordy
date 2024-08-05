/**
 * 데이터 정제기를 만든다.
 *
 * @example
 * enum MyEnum {
 *   FASHION = 'f',
 *   STYLE = 's',
 *   LOOK = 'look',
 *   PIN = 'P'
 * }
 *
 * const sanitize = createEnumSanitizer(MyEnum, MyEnum.LOOK);
 * const result = sanitize('anything');
 *
 * console.log(result); // 'look'
 *
 * @param enumType 열거형
 * @param def 범위에 속하지 않을 때 내보낼 기본값
 * @returns
 */
export function createEnumSanitizer<T>(
  enumType: Record<string, unknown>,
  def: T
): (target: unknown) => T;
/**
 * 데이터 정제기를 만든다.
 *
 * @example
 * const LIST = ['가', '나', '다'];
 *
 * const sanitize = createEnumSanitizer(LIST, LIST[2]);
 * const result = sanitize('anything');
 *
 * console.log(result); // '다'
 *
 * @param list 상수값 배열
 * @param def 범위에 속하지 않을 때 내보낼 기본값
 * @returns
 */
export function createEnumSanitizer<T>(
  list: T[],
  def: T
): (target: unknown) => T;

export function createEnumSanitizer<T>(
  enumType: Record<string, unknown> | T[],
  def: T
) {
  const enumList = Array.isArray(enumType) ? enumType : Object.values(enumType);

  return function sanitizeForEnum(target: unknown) {
    if (enumList.includes(target)) {
      return target as T;
    }
    return def;
  };
}
