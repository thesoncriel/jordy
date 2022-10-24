import {
  createEnumRefiner,
  createPageSizeRefiner,
  refinePageNumber,
} from './refine';

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

describe('createPageSizeRefiner', () => {
  const given = [10, 20, 30, 50, 100];
  const refine = createPageSizeRefiner(given);

  it('지정된 페이지 사이즈 목록에 속한 값이면 그 값을 반환한다.', () => {
    const result = refine(30);

    expect(result).toBe(30);
  });

  it('지정된 목록에 속하지 않았다면 설정된 첫번째 값을 반환한다.', () => {
    const result = refine('-');

    expect(result).toBe(10);
  });

  it('문자열 페이지 값을 주면, 그것을 숫자형으로 자동으로 변환하여 비교한다.', () => {
    const result = refine('50');

    expect(result).toBe(50);
  });

  describe('기본 인덱스 설정 예외', () => {
    it('기본 인덱스 설정이 음수라면 오류를 일으킨다.', () => {
      expect(() => createPageSizeRefiner(given, -1)).toThrowError(
        'defaultIndex'
      );
    });

    it('페이지 목록의 최대 인덱스를 초과하면 오류를 일으킨다.', () => {
      expect(() => createPageSizeRefiner(given, 5)).toThrowError(
        'defaultIndex'
      );
    });
  });
});

describe('refinePageNumber', () => {
  it('양의 정수값을 주면 그 값을 반환한다.', () => {
    const result = refinePageNumber('12');

    expect(result).toBe(12);
  });
  it('음의 정수값을 주면 절대값을 취하여 반환한다.', () => {
    const result = refinePageNumber('-88');

    expect(result).toBe(88);
  });
  it('정수로 바꿀 수 없는 값은 1을 반환한다.', () => {
    const result = refinePageNumber('');

    expect(result).toBe(1);
  });
  it('소수점이 포함되어 있다면 그 값은 버린 정수값을 반환한다.', () => {
    const result1 = refinePageNumber('-3.14');
    const result2 = refinePageNumber('3.14');

    expect(result1).toBe(3);
    expect(result2).toBe(3);
  });
});
