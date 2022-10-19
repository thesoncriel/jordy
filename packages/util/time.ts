import { isString } from './typeCheck';
import {
  DateRangeDto,
  PredefinedDateRangeType,
  PredefinedMaxMonthType,
} from '../types';

export const MAX_MONTH_LOOKUP_TABLE: Record<PredefinedMaxMonthType, number> = {
  month: 1,
  threeMonths: 3,
  sixMonths: 6,
};

function padZero(num: number) {
  return num.toString().padStart(2, '0');
}

/**
 * yyyy-MM-dd 형식의 날짜 문자열로 바꾼다.
 * @param date
 * @param delimiter
 * @returns
 */
export function dateFormat(date: Date, delimiter = '-') {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dates = date.getDate();

  return `${year}${delimiter}${padZero(month)}${delimiter}${padZero(dates)}`;
}

/**
 * yyyy-MM-dd 형식의 오늘 날짜 문자열을 가져온다.
 * @param todayRef
 * @returns
 */
export function getToday(todayRef = new Date()) {
  const dateToday = new Date(todayRef);
  const today = dateFormat(dateToday);

  return today;
}

export function getBeforeMonthAt(months = 1, todayRef = new Date()) {
  let beforeMonth: string;

  if (todayRef.getMonth() - months === 1) {
    const dateFeb = new Date(todayRef);

    dateFeb.setDate(1);
    dateFeb.setMonth(2);
    dateFeb.setDate(0);

    if (dateFeb.getDate() < todayRef.getDate()) {
      beforeMonth = dateFormat(dateFeb);

      return beforeMonth;
    }
  }

  const dateBeforeMonth = new Date(todayRef);
  dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - months);

  beforeMonth = dateFormat(dateBeforeMonth);

  return beforeMonth;
}

export function addDays(date: Date | string, days: number): string {
  if (isString(date)) {
    return addDays(new Date(date), days);
  }
  const after = new Date(date);

  after.setDate(after.getDate() + days);

  return dateFormat(after);
}

function getYesterday(todayRef = new Date()) {
  return addDays(todayRef, -1);
}

function getBeforeWeek(todayRef = new Date()) {
  return addDays(todayRef, -7);
}

function getAfterTwoWeeks(todayRef = new Date()) {
  return addDays(todayRef, 14);
}

export function toPredefinedDateRangeType(
  gte: string,
  lte: string,
  todayRef = new Date()
): PredefinedDateRangeType {
  if (!gte || !lte) {
    return '';
  }

  const today = getToday(todayRef);

  if (gte === today && lte === today) {
    return 'today';
  }

  const yesterday = getYesterday(todayRef);

  if (gte === yesterday && lte === yesterday) {
    return 'yesterday';
  }

  const beforeWeek = getBeforeWeek(todayRef);

  if (gte === beforeWeek && lte === today) {
    return 'week';
  }

  const beforeMonth = getBeforeMonthAt(1, todayRef);

  if (gte === beforeMonth && lte === today) {
    return 'month';
  }

  const before3Months = getBeforeMonthAt(3, todayRef);

  if (gte === before3Months && lte === today) {
    return 'threeMonths';
  }

  const before6Months = getBeforeMonthAt(6, todayRef);

  if (gte === before6Months && lte === today) {
    return 'sixMonths';
  }

  const beforeYear = getBeforeMonthAt(12, todayRef);

  if (gte === beforeYear && lte === today) {
    return 'year';
  }

  const afterTwoWeeks = getAfterTwoWeeks(todayRef);

  if (gte === beforeMonth && lte === afterTwoWeeks) {
    return 'calcDefRange';
  }

  return '';
}

const converter: Record<
  PredefinedDateRangeType,
  (todayRef?: Date) => DateRangeDto
> = {
  today(todayRef) {
    const today = getToday(todayRef);

    return {
      gte: today,
      lte: today,
    };
  },
  yesterday(todayRef) {
    const yesterday = getYesterday(todayRef);

    return {
      gte: yesterday,
      lte: yesterday,
    };
  },
  week(todayRef) {
    const today = getToday(todayRef);
    const beforeWeek = getBeforeWeek(todayRef);

    return {
      gte: beforeWeek,
      lte: today,
    };
  },
  month(todayRef) {
    const today = getToday(todayRef);
    const beforeMonth = getBeforeMonthAt(1, todayRef);

    return {
      gte: beforeMonth,
      lte: today,
    };
  },
  threeMonths(todayRef) {
    const today = getToday(todayRef);
    const beforeMonth = getBeforeMonthAt(3, todayRef);

    return {
      gte: beforeMonth,
      lte: today,
    };
  },
  sixMonths(todayRef) {
    const today = getToday(todayRef);
    const beforeMonth = getBeforeMonthAt(6, todayRef);

    return {
      gte: beforeMonth,
      lte: today,
    };
  },
  year(todayRef) {
    const today = getToday(todayRef);
    const beforeMonth = getBeforeMonthAt(12, todayRef);

    return {
      gte: beforeMonth,
      lte: today,
    };
  },
  calcDefRange(todayRef) {
    const beforeMonth = getBeforeMonthAt(1, todayRef);
    const afterTwoWeeks = getAfterTwoWeeks(todayRef);

    return {
      gte: beforeMonth,
      lte: afterTwoWeeks,
    };
  },
  '': () => ({ gte: '', lte: '' }),
};

export function createDateRangeByType(
  predefinedType: PredefinedDateRangeType,
  todayRef = new Date()
) {
  if (!predefinedType) {
    return {
      gte: '',
      lte: '',
    };
  }

  return converter[predefinedType](todayRef);
}

export function addMonths(date: Date | string, months: number): string {
  if (isString(date)) {
    return addMonths(new Date(date), months);
  }
  const after = new Date(date);

  after.setMonth(after.getMonth() + months);

  if (after.getDate() !== date.getDate()) {
    after.setDate(0);
  }

  return dateFormat(after);
}

export function addMonthsByPredefined(
  date: string,
  type: PredefinedMaxMonthType
) {
  return addMonths(date, MAX_MONTH_LOOKUP_TABLE[type]);
}

/**
 * 문자열값이 날짜형식(yyyy-MM-dd)에 맞는지 검사한다.
 * @param value
 * @returns
 */
export function isValidDateStr(value?: unknown): value is string {
  if (!value || !isString(value) || value.length !== 10) {
    return false;
  }
  if (/^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/.test(value) === false) {
    return false;
  }
  try {
    return dateFormat(new Date(value)) === value;
  } catch (error) {
    return false;
  }
}

/**
 * UTC로 작성된 날짜 포멧을 "yyyy-MM-dd hh:mm:ss" 포멧으로 바꿔준다.
 *
 * showSeconds 를 false 로 줄 경우 "yyyy-MM-dd hh:mm" 포멧으로 바꾼다.
 * @param dateStr
 * @param showSeconds 초단위 표현 여부. 기본 true
 * @returns
 */
export function changeDateFormat(dateStr: string, showSeconds = true) {
  if (!dateStr || dateStr.length < 19) {
    return '';
  }
  return `${dateStr.substring(0, 10)} ${dateStr.substring(
    11,
    showSeconds ? 19 : 16
  )}`;
}

/**
 * yyyy-MM-dd 형식의 날짜에 offset 을 추가하여 datetime 포멧으로 바꾼다.
 *
 * - 주로 외부와 날짜 형식을 맞춰줘야 할 때 쓰인다.
 *
 * @example
 *
 * const result = changeDateTimeFormatWithOffset('2022-06-01');
 *
 * console.log(result); // 2022-06-01T00:00:00+09:00
 * @param value 변경할 날짜 데이터
 * @param isLessThenEqual true 로 줄 경우 시간을 23:59:59 로 바꿔서 준다. 기본 false.
 * @returns
 */
export function changeDateTimeFormatWithOffset(
  value: string,
  isLessThenEqual = false
) {
  if (isLessThenEqual) {
    return `${value}T23:59:59+09:00`;
  }
  return `${value}T00:00:00+09:00`;
}
