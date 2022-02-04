import { qs } from '../queryString';

describe('qs.parse', () => {
  it('일반 문자열이 들어가면 빈 객체를 되돌려준다.', () => {
    const result = qs.parse('스팀 만쉐이 하하하');

    expect(result).toEqual({});
  });
  it('경로에 쿼리 파라미터가 있다면 그 값들을 객체로 만들어준다.', () => {
    const given = 'https://www.theson.com/test/haha/?key=koko&name=sulsul';
    const result = qs.parse(given);

    expect(result).toEqual({
      key: 'koko',
      name: 'sulsul',
    });
  });
  it('파라미터에 URL 인코딩 된 내용이 있다면 제대로 반영한다.', () => {
    const given =
      'https://www.theson.com/?title=%ED%95%98%ED%95%98%ED%98%B8%ED%98%B8%EA%B0%80%EC%A6%88%EC%95%84!';
    const result = qs.parse(given);

    expect(result).toEqual({
      title: '하하호호가즈아!',
    });
  });
});

describe('qs.serialize', () => {
  it('객체를 쿼리 문자열로 바꾼다.', () => {
    const given = {
      haha: 'comeon',
      age: 23,
    };
    const result = qs.serialize(given);

    expect(result).toBe('haha=comeon&age=23');
  });
  it('특정키에 하위 객체가 있다면 하위 객체 키는 뒷쪽에 uri encoding 된 bracket 이 적용되어 있다.', () => {
    const given = {
      sub: {
        name: 'sonic',
        page: 12,
      },
      korea: 'yes',
    };
    const result = qs.serialize(given);

    expect(result).toBe('sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes');
  });
  it('값에 한글이 포함되어 있다면 uri encoding 된다.', () => {
    const given = {
      sub: {
        name: '살아가리라',
        page: 12,
      },
      korea: '네',
    };
    const result = qs.serialize(given);

    expect(result).toBe(
      `sub%5Bname%5D=${encodeURIComponent(
        given.sub.name
      )}&sub%5Bpage%5D=12&korea=${encodeURIComponent(given.korea)}`
    );
  });
  it('두번째 인자가 true 면, 결과물 앞에 ?가 붙는다.', () => {
    const given = {
      sub: {
        name: 'sonic',
        page: 12,
      },
      korea: 'yes',
    };
    const result = qs.serialize(given, true);

    expect(result).toBe('?sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes');
  });
  it('값에 숫자 0이 있어도 없어지지 않고 포함된다.', () => {
    const given = {
      zero: 0,
      empty: '',
    };
    const result = qs.serialize(given);

    expect(result).toBe('zero=0&empty=');
  });
  describe('값에 null 이나 undefined, NaN 등이 있으면 빈 값으로 처리한다.', () => {
    const cases = [null, undefined, NaN];

    cases.forEach((item) => {
      it(`${item} 일 때`, () => {
        const given = {
          empty: item,
          name: 'tails',
        };
        const result = qs.serialize(given);

        expect(result).toBe('empty=&name=tails');
      });
    });
  });
  describe('값이 올바른 객체가 아니라면 오류를 일으킨다.', () => {
    const cases = [
      {
        title: 'number',
        value: 0,
      },
      {
        title: 'string',
        value: 'haha',
      },
      {
        title: 'null',
        value: null,
      },
      {
        title: 'undefined',
        value: undefined,
      },
      {
        title: 'NaN',
        value: NaN,
      },
    ];
    cases.forEach((caseItem) => {
      it(`${caseItem.title} 일 때`, () => {
        const given = caseItem.value;
        const resultFn = () => qs.serialize(given);

        expect(resultFn).toThrowError('not object');
      });
    });
  });
});
