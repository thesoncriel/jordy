import { createPageSizeSanitizer } from './createPageSizeSanitizer';

describe('createPageSizeSanitizer', () => {
  const given = [10, 20, 30, 50, 100];
  const sanitize = createPageSizeSanitizer(given);

  it('지정된 페이지 사이즈 목록에 속한 값이면 그 값을 반환한다.', () => {
    const result = sanitize(30);

    expect(result).toBe(30);
  });

  it('지정된 목록에 속하지 않았다면 설정된 첫번째 값을 반환한다.', () => {
    const result = sanitize('-');

    expect(result).toBe(10);
  });

  it('문자열 페이지 값을 주면, 그것을 숫자형으로 자동으로 변환하여 비교한다.', () => {
    const result = sanitize('50');

    expect(result).toBe(50);
  });

  describe('기본 인덱스 설정 예외', () => {
    it('기본 인덱스 설정이 음수라면 오류를 일으킨다.', () => {
      expect(() => createPageSizeSanitizer(given, -1)).toThrowError(
        'defaultIndex'
      );
    });

    it('페이지 목록의 최대 인덱스를 초과하면 오류를 일으킨다.', () => {
      expect(() => createPageSizeSanitizer(given, 5)).toThrowError(
        'defaultIndex'
      );
    });
  });
});
