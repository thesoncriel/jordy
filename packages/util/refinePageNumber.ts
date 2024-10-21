/**
 * 페이지 번호를 정제한다.
 *
 * 0보다 큰 양의 정수만 통과시킨다. (문자열 입력 가능)
 *
 * const result = refinePageNumber('-1');
 *
 * console.log(result); // 1
 * @param raw
 * @returns
 */
export function refinePageNumber(raw: unknown) {
  const page = Math.floor(Math.abs(Number(raw || 1)));

  if (Number.isFinite(page) && page > 0) {
    return page;
  }
  return 1;
}
