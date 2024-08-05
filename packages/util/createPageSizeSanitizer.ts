/**
 * 페이지 사이즈에 대한 정제기를 만든다.
 *
 * @example
 *
 * const sanitize = createPageSizeSanitizer([10, 20, 30]);
 * let result = sanitize(100);
 *
 * console.log(result); // 10
 *
 * result = sanitize('20');
 *
 * console.log(result); // 20
 *
 * @param sizeList
 * @param defaultIndex 기본 0
 * @returns
 */
export function createPageSizeSanitizer(sizeList: number[], defaultIndex = 0) {
  if (defaultIndex < 0 || defaultIndex > sizeList.length - 1) {
    throw new Error(`invalid defaultIndex: ${defaultIndex}`);
  }

  return function sanitizeForEnum(target: unknown) {
    try {
      const page = Number(target);

      if (sizeList.includes(page)) {
        return page;
      }
    } catch (error) {
      //
    }

    return sizeList[defaultIndex];
  };
}
