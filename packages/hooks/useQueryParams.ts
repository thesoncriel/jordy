import { useCallback, useMemo, useRef } from 'react';
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
 * @param deepEqual 이전 값과 현재 값이 동일한지 비교하는 함수.
 * @see useParams
 * @see qs.parse
 */
export function useQueryParams<T>(
  selector: (params: Record<string, string>) => T,
  deepEqual?: (prev: T, next: T) => boolean
): T;

export function useQueryParams<T>(
  selector: (params: Record<string, string>) => T = defSelector,
  deepEqual?: (prev: T, next: T) => boolean
): T {
  const refPrev = useRef<T | null>(null);
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
    const convertedData = selConverter(innerResult);

    if (deepEqual) {
      if (deepEqual(refPrev.current, convertedData)) {
        return refPrev.current;
      }

      refPrev.current = convertedData;
    }

    return convertedData;
  }, [searchString, params, selConverter, deepEqual]);

  return result;
}
