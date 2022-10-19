import { PredefinedDateRangeType } from 'packages/types';
import {
  addMonths,
  createDateRangeByType,
  dateFormat,
  getBeforeMonthAt,
  isValidDateStr,
  toPredefinedDateRangeType,
} from './time';

describe('addMonths', () => {
  it('지정된 개월수 만큼 증가된 날짜를 만든다.', () => {
    const result = addMonths(new Date('2012-06-01'), 1);

    expect(result).toBe('2012-07-01');
  });
  describe('변경된 월의 일수가 기준 연월 보다 적을 경우', () => {
    it('변경된 월의 가장 마지막 날을 기준으로 만든다.', () => {
      const result = addMonths(new Date('2012-10-31'), 1);

      expect(result).toBe('2012-11-30');
    });
    it('결과가 2월이어도 의도대로 변경된다.', () => {
      const result = addMonths(new Date('2012-10-31'), 4);

      expect(result).toBe('2013-02-28');
    });
    it('변경 결과가 윤달이어도 의도대로 월이 추가된다.', () => {
      const result = addMonths(new Date('2019-11-30'), 3);

      expect(result).toBe('2020-02-29');
    });
  });
});

describe('createDateRangeByType', () => {
  it('오늘에 대응되는 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'today';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '2021-08-15',
      lte: '2021-08-15',
    });
  });
  it('어제에 대응되는 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'yesterday';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '2021-08-14',
      lte: '2021-08-14',
    });
  });
  it('지난 일주일 동안에 대응되는 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'week';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '2021-08-08',
      lte: '2021-08-15',
    });
  });
  it('지난 한달 동안에 대응되는 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'month';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '2021-07-15',
      lte: '2021-08-15',
    });
  });
  it('지난 일년 동안에 대응되는 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'year';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '2020-08-15',
      lte: '2021-08-15',
    });
  });

  it('지난달이 윤달이어도 정상적으로 날짜 범위를 만들 수 있다.', () => {
    const given: PredefinedDateRangeType = 'month';
    const result1 = createDateRangeByType(given, new Date('2016-03-29'));
    const result2 = createDateRangeByType(given, new Date('2016-03-31'));

    expect(result1).toEqual({
      gte: '2016-02-29',
      lte: '2016-03-29',
    });
    expect(result2).toEqual({
      gte: '2016-02-29',
      lte: '2016-03-31',
    });
  });
  it('빈 값이 올 경우 범위 값은 비어있다.', () => {
    const given: PredefinedDateRangeType = '';
    const result = createDateRangeByType(given, new Date('2021-08-15'));

    expect(result).toEqual({
      gte: '',
      lte: '',
    });
  });
});

describe('dateFormat', () => {
  it('입력된 날짜 객체를 yyyy-MM-dd 형태로 바꾼다.', () => {
    const given = new Date('2021-06-01');
    const result = dateFormat(given);

    expect(result).toBe('2021-06-01');
  });
  it('잘못된 날짜값이면 오류를 발생시킨다.', () => {
    expect(() => dateFormat(null as unknown as Date)).toThrow();
    expect(() => dateFormat('' as unknown as Date)).toThrow();
    expect(() => dateFormat(undefined as unknown as Date)).toThrow();
    expect(() => dateFormat(12345 as unknown as Date)).toThrow();
    expect(() => dateFormat(NaN as unknown as Date)).toThrow();
  });
});

describe('getBeforeMonthAt', () => {
  const todayRef = new Date('2017-11-20');

  it('지정된 개월수만큼 이전 날짜를 만들어준다.', () => {
    const result = getBeforeMonthAt(3, todayRef);

    expect(result).toBe('2017-08-20');
  });
  it('6개월 이전 날짜도 정상적으로 만들어진다.', () => {
    const result = getBeforeMonthAt(6, todayRef);

    expect(result).toBe('2017-05-20');
  });
  it('만들어질 날짜가 2월이면 윤달이 적용된다.', () => {
    const result = getBeforeMonthAt(3, new Date('2017-05-30'));

    expect(result).toBe('2017-02-28');
  });
  it('만들어질 날짜가 윤달이어도 최대 날짜에 포함되면 정상적으로 적용된다.', () => {
    const result = getBeforeMonthAt(3, new Date('2017-05-28'));

    expect(result).toBe('2017-02-28');
  });
});

describe('isValidDateStr', () => {
  it('yyyy-MM-dd 형식으로 포메팅된 날짜 문자열이면 유효하다.', () => {
    const result = isValidDateStr('2012-06-01');

    expect(result).toBeTruthy();
  });
  it('빈 값은 유효하지 않다.', () => {
    const result = isValidDateStr('');

    expect(result).toBeFalsy();
  });
  it('형식에 맞지 않으면 유효하지 않다.', () => {
    const result = isValidDateStr('2022.06.01');

    expect(result).toBeFalsy();
  });
  it('실제 존재할 수 없는 날짜는 유효하지 않다.', () => {
    const result = isValidDateStr('2022-02-29');

    expect(result).toBeFalsy();
  });
});

describe('toPredefinedType', () => {
  it('범위가 오늘 날짜라면 "오늘"이다.', () => {
    const given = {
      gte: '2021-11-01',
      lte: '2021-11-01',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-11-01')
    );

    expect(result).toBe('today');
  });
  it('범위가 어제 날짜라면 "어제"이다', () => {
    const given = {
      gte: '2021-10-31',
      lte: '2021-10-31',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-11-01')
    );

    expect(result).toBe('yesterday');
  });
  it('범위가 오늘부터 일주일 간격이라면, "주간"이다', () => {
    const given = {
      gte: '2021-10-25',
      lte: '2021-11-01',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-11-01')
    );

    expect(result).toBe('week');
  });
  it('범위가 오늘부터 한달 간격이라면, "월간"이다', () => {
    const given = {
      gte: '2021-10-01',
      lte: '2021-11-01',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-11-01')
    );

    expect(result).toBe('month');
  });
  it('범위가 오늘부터 12개월 차이일 경우 "연간"이다.', () => {
    const given = {
      gte: '2020-11-01',
      lte: '2021-11-01',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-11-01')
    );

    expect(result).toBe('year');
  });
  it('오늘이 3월 30일이고 전날이 2월 막날이면 "월간"이다.', () => {
    const given = {
      gte: '2021-02-28',
      lte: '2021-03-30',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-03-30')
    );

    expect(result).toBe('month');
  });
  it('오늘이 3월 30일이고 전날이 2월 27이면 아무것도 아니다.', () => {
    const given = {
      gte: '2021-02-27',
      lte: '2021-03-30',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-03-30')
    );

    expect(result).toBe('');
  });
  it('지난달이 윤달이어도 정상적으로 동작된다.', () => {
    const given = {
      gte: '2016-02-29',
      lte: '2016-03-30',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2016-03-30')
    );

    expect(result).toBe('month');
  });
  it('전후 날짜 중 하나가 비어 있으면 아무것도 아니다.', () => {
    const given = {
      gte: '',
      lte: '2021-11-01',
    };
    const result = toPredefinedDateRangeType(
      given.gte,
      given.lte,
      new Date('2021-12-01')
    );

    expect(result).toBe('');
  });
});
