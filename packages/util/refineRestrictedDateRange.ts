import {
  DateRangeDto,
  PredefinedMaxMonthType,
  PredefinedDateRangeType,
} from '../types/time.type';
import {
  isValidDateStr,
  createDateRangeByType,
  addMonthsByPredefined,
} from './time';

/**
 * 제한된 기준으로 날짜범위값을 정제한다.
 *
 * 범위 기준은 DateRange->gte (시작날짜) 이다.
 * @param dateRange 정제할 날짜범위 객체
 * @param maxType 정제 허용 최대 범위. 1달, 3달, 6달 중 1가지
 * @param defType 날짜범위 내용 중 하나라도 비었을 경우 기본적으로 만들어 줄 날짜 범위 유형
 * @returns
 */
export function refineRestrictedDateRange<T extends DateRangeDto>(
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
