/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmptyObject, isString } from './typeCheck';

/**
 * 간단한 템플릿 메시지 처리기.
 *
 * 중괄호({})로 구성된 메시지 템플릿에 주어진 객체의 값을 이용하여 메시지를 완성한다.
 *
 * ```ts
 * const tmpl = '총 {totalCount}개의 상태가 {status}으로 바뀝니다.\n계속 하시겠습니까?';
 * const data = {
 *   totalCount: 320,
 *   status: '배송중',
 * };
 * const message = messageTemplate(tmpl, data);
 * // 총 320개의 상태가 배송중으로 바뀝니다.\n계속 하시겠습니까?
 * ```
 *
 * @param tmplText 템플릿이 적용된 메시지
 * @param data 적용될 객체 데이터
 * @returns 만들어진 메시지
 */
export function messageTemplate<T extends Record<string, string | number>>(
  tmplText: string,
  data: T
) {
  if (!tmplText || !data || isEmptyObject(data)) {
    return '';
  }

  if (Array.isArray(data)) {
    throw new Error('messageTemplate: The "data" argument cannot be an array.');
  }
  return Object.entries(data).reduce((semiResult, [key, value]) => {
    if (isString(value) || Number.isFinite(value)) {
      return semiResult.replace(
        new RegExp(`\\{${key}\\}`, 'gi'),
        value.toString()
      );
    }

    throw new Error(
      `messageTemplate: The "${value}" of key "${key}" is not valid.`
    );
  }, tmplText);
}
