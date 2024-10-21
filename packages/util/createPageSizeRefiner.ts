/**
 * 페이지 사이즈에 대한 정제기를 만든다.
 *
 * @example
 *
 * const refine = createPageSizeRefiner([10, 20, 30]);
 * let result = refine(100);
 *
 * console.log(result); // 10
 *
 * result = refine('20');
 *
 * console.log(result); // 20
 *
 * @param sizeList
 * @param defaultIndex 기본 0
 * @returns
 */
export function createPageSizeRefiner(sizeList: number[], defaultIndex = 0) {
  if (defaultIndex < 0 || defaultIndex > sizeList.length - 1) {
    throw new Error(`invalid defaultIndex: ${defaultIndex}`);
  }

  return function refineForEnum(target: unknown) {
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
