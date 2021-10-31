/**
 * 주어진 배열내 특정 2가지 요소에 대하여 서로 순서를 뒤바꾼다.
 * 
 * sortable ui 결과를 이용할 때 쓰인다.
 * @param list 
 * @param startIndex 
 * @param endIndex 
 * @returns 
 */
export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * 주어진 배열의 특정 인덱스에 대하여 제시된 아이템 내용으로 업데이트한다.
 * @param list 
 * @param index 
 * @param item 
 * @returns 
 */
export function update<T>(list: T[], index: number, item: T) {
  const copied = [...list];

  copied[index] = item;

  return copied;
}

/**
 * 주어진 배열에서 특정 인덱스의 아이템을 삭제한다.
 * @param list 
 * @param index 
 * @returns 
 */
export function remove<T>(list: T[], index: number) {
  const copied = [...list];

  copied.splice(index, 1);

  return copied;
}
