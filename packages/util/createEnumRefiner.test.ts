import { createEnumRefiner } from './createEnumRefiner';

enum TestEnum {
  Sonic = 'sonic',
  Tails = 'miles',
  Knuckles = 'k.t.e',
}

describe('createEnumRefiner', () => {
  describe('enum', () => {
    const refine = createEnumRefiner(TestEnum, TestEnum.Sonic);

    it('지정된 enum 에 속한 값이면 그 값을 반환한다.', () => {
      const result = refine(TestEnum.Tails);

      expect(result).toBe(TestEnum.Tails);
    });

    it('enum 에 속한 값이 아니라면 기본값을 반환한다.', () => {
      const result = refine('what the f*ck ?!');

      expect(result).toBe(TestEnum.Sonic);
    });
  });

  describe('array', () => {
    const given = ['하나', '둘', '셋', '룩핀', '만쉐이'];
    const refine = createEnumRefiner(given, given[2]);

    it('지정된 array 에 속한 값이면 그 값을 반환한다.', () => {
      const result = refine(given[3]);

      expect(result).toBe(given[3]);
    });

    it('array 에 속한 값이 아니라면 기본값을 반환한다.', () => {
      const result = refine('what the f*ck ?!');

      expect(result).toBe(given[2]);
    });
  });
});
