import { useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { qs } from '../util/queryString';

const defSelector = <T>(params: Record<string, string>) => {
  return params as unknown as T;
};

/**
 * 훅: 웹브라우저의 URL 파라미터 및 쿼리 파라미터를 합쳐서 하나의 객체로 만들어준다.
 *
 * 주의1: 쿼리 및 URL 파라미터의 key name 이 중복되지 않는 조건에서 사용해야한다.
 *
 * @see useParams
 * @see qs.parse
 */
export function useQueryParams<T = unknown>(): T;
/**
 * 훅: 웹브라우저의 URL 파라미터 및 쿼리 파라미터를 합쳐서 하나의 객체로 만들어준다.
 *
 * 주의1: 쿼리 및 URL 파라미터의 key name 이 중복되지 않는 조건에서 사용해야한다.
 *
 * @param selector 변환된 쿼리 파라미터 객체를 원하는 타입으로 직접 변환하는 셀렉터.
 * @see useParams
 * @see qs.parse
 */
export function useQueryParams<T>(
  selector: (params: Record<string, string>) => T
): T;

export function useQueryParams<T>(
  selector: (params: Record<string, string>) => T = defSelector
): T {
  const selConverter = useCallback(selector, []);
  const location = useLocation();
  const params = useParams<Record<string, string>>();
  const searchString = location.search;
  const result = useMemo(() => {
    const query = qs.parse(searchString);
    const innerResult = {
      ...query,
      ...params,
    };
    return selConverter(innerResult);
  }, [searchString, params, selConverter]);

  return result;
}
