import { sanitizePageNumber } from './sanitizePageNumber';

describe('sanitizePageNumber', () => {
  it('양의 정수값을 주면 그 값을 반환한다.', () => {
    const result = sanitizePageNumber('12');

    expect(result).toBe(12);
  });
  it('음의 정수값을 주면 절대값을 취하여 반환한다.', () => {
    const result = sanitizePageNumber('-88');

    expect(result).toBe(88);
  });
  it('정수로 바꿀 수 없는 값은 1을 반환한다.', () => {
    const result = sanitizePageNumber('');

    expect(result).toBe(1);
  });
  it('소수점이 포함되어 있다면 그 값은 버린 정수값을 반환한다.', () => {
    const result1 = sanitizePageNumber('-3.14');
    const result2 = sanitizePageNumber('3.14');

    expect(result1).toBe(3);
    expect(result2).toBe(3);
  });
});
