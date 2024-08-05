import { DateRangeDto, PredefinedDateRangeType } from '../types/time.type';
import { createDateRangeByType, isValidDateStr } from './time';

function sanitizeDate(value: string | undefined, def: string) {
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
export function sanitizeDateRange(
  dateRange: Partial<DateRangeDto> | Record<string, string> | undefined | null,
  preset: PredefinedDateRangeType = 'month'
) {
  const def = createDateRangeByType(preset);

  if (!dateRange || !dateRange.gte || !dateRange.lte) {
    return def;
  }

  const gte = sanitizeDate(dateRange.gte, def.gte);
  const lte = sanitizeDate(dateRange.lte, def.lte);

  return {
    gte,
    lte,
  };
}
