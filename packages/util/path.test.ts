import { getFileName } from './path';

describe('getFileName', () => {
  it('주어진 경로의 최하위 경로 값을 반환한다.', () => {
    const given = '/hoho/haha/kaka/whatsThat';
    const result = getFileName(given);

    expect(result).toBe('whatsThat');
  });
  it('유효하지 않은 경로 값이면 받은 값을 되돌려준다.', () => {
    const given = 'hohohaha';
    const result = getFileName(given);

    expect(result).toBe(given);
  });
  it('최하위 경로에 확장자가 있다면 그것도 함께 반환한다.', () => {
    const given = '/hoho/haha/kaka/theson.pptx';
    const result = getFileName(given);

    expect(result).toBe('theson.pptx');
  });
  it('최하위 경로 뒷쪽에 각종 파라미터가 있다면 그것을 제외하고 반환한다.', () => {
    const given = '/hoho/haha/kaka/theson.pptx?key=true&name=theson';
    const result = getFileName(given);

    expect(result).toBe('theson.pptx');
  });
});
