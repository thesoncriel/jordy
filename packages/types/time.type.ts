export type PredefinedMaxMonthType = 'month' | 'threeMonths' | 'sixMonths';

export type PredefinedDateRangeType =
  | ''
  | 'yesterday'
  | 'today'
  | 'week'
  | 'month'
  | 'threeMonths'
  | 'sixMonths'
  | 'year'
  | 'calcDefRange';

export interface DateRangeDto {
  /**
   * 시작날짜
   *
   * yyyy-mm-dd 형식
   */
  gte: string;
  /**
   * 종료날짜
   *
   * yyyy-mm-dd 형식
   */
  lte: string;
}