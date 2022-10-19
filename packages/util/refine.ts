import {
  DateRangeDto,
  PredefinedMaxMonthType,
  PredefinedDateRangeType,
} from '../types';
import {
  isValidDateStr,
  createDateRangeByType,
  addMonthsByPredefined,
} from './time';

/**
 * 데이터 정제기를 만든다.
 *
 * @example
 * enum MyEnum {
 *   FASHION = 'f',
 *   STYLE = 's',
 *   LOOK = 'look',
 *   PIN = 'P'
 * }
 *
 * const refine = createEnumRefiner(MyEnum, MyEnum.LOOK);
 * const result = refine('anything');
 *
 * console.log(result); // 'look'
 *
 * @param enumType 열거형
 * @param def 범위에 속하지 않을 때 내보낼 기본값
 * @returns
 */
export function createEnumRefiner<T>(
  enumType: Record<string, unknown>,
  def: T
): (target: unknown) => T;
/**
 * 데이터 정제기를 만든다.
 *
 * @example
 * const LIST = ['가', '나', '다'];
 *
 * const refine = createEnumRefiner(LIST, LIST[2]);
 * const result = refine('anything');
 *
 * console.log(result); // '다'
 *
 * @param list 상수값 배열
 * @param def 범위에 속하지 않을 때 내보낼 기본값
 * @returns
 */
export function createEnumRefiner<T>(list: T[], def: T): (target: unknown) => T;

export function createEnumRefiner<T>(
  enumType: Record<string, unknown> | T[],
  def: T
) {
  const enumList = Array.isArray(enumType) ? enumType : Object.values(enumType);

  return function refineForEnum(target: unknown) {
    if (enumList.includes(target)) {
      return target as T;
    }
    return def;
  };
}

/**
 * 페이지 사이즈에 대한 정제기를 만든다.
 *
 * @example
 *
 * const refine = createPageSizeRefiner([10, 20, 30]);
 * let result = refine(100);
 *
 * console.log(result); // 10
 *
 * result = refine('20');
 *
 * console.log(result); // 20
 *
 * @param sizeList
 * @param defaultIndex 기본 0
 * @returns
 */
export function createPageSizeRefiner(sizeList: number[], defaultIndex = 0) {
  return createEnumRefiner(sizeList, sizeList[defaultIndex]);
}

/**
 * 페이지 번호를 정제한다.
 *
 * 0보다 큰 양의 정수만 통과시킨다. (문자열 입력 가능)
 *
 * const result = refinePageNumber('-1');
 *
 * console.log(result); // 1
 * @param raw
 * @returns
 */
export function refinePageNumber(raw: unknown) {
  const page = Math.floor(Math.abs(Number(raw || 1)));

  if (Number.isFinite(page) && page > 0) {
    return page;
  }
  return 1;
}

/**
 * 제한된 기준으로 날짜범위값을 정제한다.
 *
 * 범위 기준은 DateRange->gte (시작날짜) 이다.
 * @param dateRange 정제할 날짜범위 객체
 * @param maxType 정제 허용 최대 범위. 1달, 3달, 6달 중 1가지
 * @param defType 날짜범위 내용 중 하나라도 비었을 경우 기본적으로 만들어 줄 날짜 범위 유형
 * @returns
 */
export function refineToRestrictedDateRange<T extends DateRangeDto>(
  dateRange: T,
  maxType: PredefinedMaxMonthType,
  defType?: PredefinedDateRangeType
) {
  const result = {
    ...dateRange,
  };

  result.gte = isValidDateStr(result.gte) ? result.gte : '';
  result.lte = isValidDateStr(result.lte) ? result.lte : '';

  if (!result.gte || !result.lte) {
    if (defType) {
      const tmp = createDateRangeByType(defType);

      result.gte = tmp.gte;
      result.lte = tmp.lte;
    }
    return result;
  }

  const maxMonth = addMonthsByPredefined(result.gte, maxType);

  if (result.lte > maxMonth) {
    result.lte = maxMonth;
  } else if (result.lte < result.gte) {
    result.lte = result.gte;
  }
  return result;
}

function refineDate(value: string | undefined, def: string) {
  if (!isValidDateStr(value)) {
    return def;
  }
  return value;
}

/**
 * 날짜범위를 지정된 규칙에 따라 정제한다.
 * @param dateRange 정제할 날짜범위 값.
 * @param preset 지정할 규칙
 * @returns
 */
export function refineDateRange(
  dateRange: Partial<DateRangeDto> | Record<string, string> | undefined | null,
  preset: PredefinedDateRangeType = 'month'
) {
  const def = createDateRangeByType(preset);

  if (!dateRange || !dateRange.gte || !dateRange.lte) {
    return def;
  }

  const gte = refineDate(dateRange.gte, def.gte);
  const lte = refineDate(dateRange.lte, def.lte);

  return {
    gte,
    lte,
  };
}
