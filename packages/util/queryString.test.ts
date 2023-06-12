import { qs } from './queryString';

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
  it('파라미터에 띄어쓰기에 의한 "+"가 존재한다면 이를 치환하여 반영한다.', () => {
    const given =
      'https://www.theson.com/?title=유니버시티+%2B+로얄+스탠다드+숏팬츠';
    const result = qs.parse(given);

    expect(result).toEqual({
      title: '유니버시티 + 로얄 스탠다드 숏팬츠',
    });
  });
});

describe('qs.serialize', () => {
  it.each([
    {
      desc: '객체를 쿼리 문자열로 바꾼다.',
      given1: {
        haha: 'comeon',
        age: 23,
      },
      expected: 'haha=comeon&age=23',
    },
    {
      desc: '특정키에 하위 객체가 있다면 하위 객체 키는 뒷쪽에 uri encoding 된 bracket 이 적용되어 있다.',
      given1: {
        sub: {
          name: 'sonic',
          page: 12,
        },
        korea: 'yes',
      },
      expected: 'sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes',
    },
    {
      desc: '값에 한글이 포함되어 있다면 uri encoding 된다.',
      given1: {
        sub: {
          name: '살아가리라',
          page: 12,
        },
        korea: '네',
      },
      expected: `sub%5Bname%5D=${encodeURIComponent(
        '살아가리라'
      )}&sub%5Bpage%5D=12&korea=${encodeURIComponent('네')}`,
    },
    {
      desc: '두번째 인자가 true 면, 결과물 앞에 ?가 붙는다.',
      given1: {
        sub: {
          name: 'sonic',
          page: 12,
        },
        korea: 'yes',
      },
      given2: true,
      expected: '?sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes',
    },
    {
      desc: '값에 숫자 0이 있어도 없어지지 않고 포함된다.',
      given1: {
        zero: 0,
        empty: '',
      },
      expected: 'zero=0&empty=',
    },
    {
      desc: '배열값을 넣으면 쉼표(,)가 인코딩된 값으로 구분되어진다.',
      given1: {
        arr: [1, 2, 3, 4, 5],
      },
      expected: 'arr=1%2C2%2C3%2C4%2C5',
    },
  ])('$desc', ({ given1, given2, expected }) => {
    const result = qs.serialize(given1, given2);

    expect(result).toBe(expected);
  });
});

describe('qs.serializeWithBrackets', () => {
  it.each([
    {
      desc: '객체를 쿼리 문자열로 바꾼다.',
      given1: {
        haha: 'comeon',
        age: 23,
      },
      expected: 'haha=comeon&age=23',
    },
    {
      desc: '특정키에 하위 객체가 있다면 하위 객체 키는 뒷쪽에 uri encoding 된 bracket 이 적용되어 있다.',
      given1: {
        sub: {
          name: 'sonic',
          page: 12,
        },
        korea: 'yes',
      },
      expected: 'sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes',
    },
    {
      desc: '특정키에 하위 배열이 있다면 하위 배열 키 뒷쪽에 uri encoding 된 bracket 이 적용되어 있다.',
      given1: {
        arr: [1, 2, 3],
      },
      expected: 'arr%5B%5D=1&arr%5B%5D=2&arr%5B%5D=3',
      decoded: 'arr[]=1&arr[]=2&arr[]=3',
    },
    {
      desc: '특정키에 하위 배열이 있고 그 요소가 객체라면 하위 배열 키 뒷쪽과 하위 객체 필드명에 uri encoding 된 bracket 이 적용된다.',
      given1: {
        myData: [
          {
            name: 'theson',
            age: 21,
          },
          {
            name: '죠르디',
            age: 20,
          },
        ],
      },
      expected:
        'myData%5B%5D%5Bname%5D=theson&myData%5B%5D%5Bage%5D=21&myData%5B%5D%5Bname%5D=%EC%A3%A0%EB%A5%B4%EB%94%94&myData%5B%5D%5Bage%5D=20',
      decoded:
        'myData[][name]=theson&myData[][age]=21&myData[][name]=죠르디&myData[][age]=20',
    },
    {
      desc: '특정키에 하위 객체 배열과 일반 필드가 섞여 있어도 의도대로 동작된다.',
      given1: {
        myData: [
          {
            name: 'theson',
            age: 21,
          },
          {
            name: '죠르디',
            age: 20,
          },
        ],
        ohMy: 'lookpin',
      },
      expected:
        'myData%5B%5D%5Bname%5D=theson&myData%5B%5D%5Bage%5D=21&myData%5B%5D%5Bname%5D=%EC%A3%A0%EB%A5%B4%EB%94%94&myData%5B%5D%5Bage%5D=20&ohMy=lookpin',
      decoded:
        'myData[][name]=theson&myData[][age]=21&myData[][name]=죠르디&myData[][age]=20&ohMy=lookpin',
    },
    {
      desc: '값에 한글이 포함되어 있다면 uri encoding 된다.',
      given1: {
        sub: {
          name: '살아가리라',
          page: 12,
        },
        korea: '네',
      },
      expected: `sub%5Bname%5D=${encodeURIComponent(
        '살아가리라'
      )}&sub%5Bpage%5D=12&korea=${encodeURIComponent('네')}`,
    },
    {
      desc: '두번째 인자가 true 면, 결과물 앞에 ?가 붙는다.',
      given1: {
        sub: {
          name: 'sonic',
          page: 12,
        },
        korea: 'yes',
      },
      given2: true,
      expected: '?sub%5Bname%5D=sonic&sub%5Bpage%5D=12&korea=yes',
    },
    {
      desc: '값에 숫자 0이 있어도 없어지지 않고 포함된다.',
      given1: {
        zero: 0,
        empty: '',
      },
      expected: 'zero=0&empty=',
    },
  ])('$desc', ({ given1, given2, expected, decoded }) => {
    const result = qs.serializeWithBrackets(given1, given2);

    expect(result).toBe(expected);

    if (decoded) {
      expect(decodeURIComponent(result)).toBe(decoded);
    }
  });

  describe('값에 null 이나 undefined, NaN 등이 있으면 빈 값으로 처리한다.', () => {
    describe('qs.serialize', () => {
      it.each([null, undefined, NaN])('%s 일 때', (value) => {
        const given = {
          empty: value,
          name: 'tails',
        };
        const result = qs.serialize(given);

        expect(result).toBe('empty=&name=tails');
      });
    });

    describe('qs.serializeWithBrackets', () => {
      it.each([null, undefined, NaN])('%s 일 때', (value) => {
        const given = {
          empty: value,
          name: 'tails',
        };
        const result = qs.serializeWithBrackets(given);

        expect(result).toBe('empty=&name=tails');
      });
    });
  });

  describe('값이 올바른 객체가 아니라면 오류를 일으킨다.', () => {
    describe('qs.serialize', () => {
      it.each([
        ['number', 0],
        ['string', 'haha'],
        ['null', null],
        ['undefined', undefined],
        ['NaN', NaN],
      ])('%s 일 때', (_, given) => {
        const resultFn = () => qs.serialize(given);

        expect(resultFn).toThrowError('not object');
      });
    });

    describe('qs.serializeWithBrackets', () => {
      it.each([
        ['number', 0],
        ['string', 'haha'],
        ['null', null],
        ['undefined', undefined],
        ['NaN', NaN],
      ])('%s 일 때', (_, given) => {
        const resultFn = () => qs.serializeWithBrackets(given);

        expect(resultFn).toThrowError('not object');
      });
    });
  });
});
