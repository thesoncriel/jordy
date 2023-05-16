/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useLayoutEffect, useRef } from 'react';
import {
  NavigateOptions,
  Path,
  To,
  useNavigate as useRcNavigate,
  useSearchParams,
} from 'react-router-dom';

import { isNullable, isObject, isUndefined } from '../util';

export type SearchParams = Record<string, any>;
export type SearchParamsOptions = NavigateOptions & { merge?: boolean };

interface NavigationCommander {
  (to: To, option?: NavigateOptions): void;
  (delta: number): void;
  (searchParams: SearchParams, option?: SearchParamsOptions): void;
}

function instanceOfTo(to: unknown): to is Partial<Path> {
  return isObject(to) && ('pathname' in to || 'search' in to || 'hash' in to);
}

function instanceOfSearchParams(to: unknown): to is SearchParams {
  return !instanceOfTo(to) && isObject(to);
}

function isMergeQueries(option: SearchParamsOptions): boolean {
  return isUndefined(option) || (option && option['merge'] === true);
}

function refineQueries(queries: Record<string, any>): Record<string, any> {
  return Object.entries(queries).reduce((acc, [key, value]) => {
    if (!isNullable(value) && value !== '') {
      acc[key] = value;
    }

    return acc;
  }, {} as Record<string, any>);
}

/**
 * react-router-dom v6의 useNavigate 기반으로 기능을 확장한 hooks.
 *
 * navigate 동작 방식을 똑같이 사용할 수 있으며, 필요에 따라 query 조작이 가능하다.
 *
 * 일반 navigate 함수 활용
 * @example
 * ```ts
 * const navigate = useNavigate();
 *
 * navigate(-1);
 * navigate("/page", option);
 * navigate({ pathname: "/page", search : "size=10" }, option);
 * ```
 *
 * 현재 페이지의 query에 원하는 query를 덮어씌워 이동
 *
 * @example
 * ```ts
 * const navigate = useNavigate();
 *
 * navigate({ page: 10, size: 20 });
 *
 * ```
 *
 * 현재 페이지의 query는 제거하고, 원하는 query로만 이동
 * @example
 * ```ts
 * const navigate = useNavigate();
 *
 * navigate({ page: 10, size: 20 }, { merge: false });
 *
 * ```
 */
export function useNavigate(): NavigationCommander {
  const [currentSearchParams, setSearchParams] = useSearchParams();
  const navigate = useRcNavigate();
  const refSearchParams = useRef(currentSearchParams);
  const refSetSearchParams = useRef(setSearchParams);
  const refNavigate = useRef(navigate);

  useLayoutEffect(() => {
    refSearchParams.current = currentSearchParams;
    refNavigate.current = navigate;
    refSetSearchParams.current = setSearchParams;
  }, [currentSearchParams, navigate, setSearchParams]);

  const navigation = useCallback(
    (
      to: To | number | SearchParams,
      option?: NavigateOptions | SearchParamsOptions
    ): void => {
      if (typeof to === 'number') {
        return refNavigate.current(to);
      }

      if (typeof to === 'string') {
        return refNavigate.current(to, option);
      }

      if (instanceOfTo(to)) {
        return refNavigate.current(to, option);
      }

      if (instanceOfSearchParams(to)) {
        if (isMergeQueries(option)) {
          const currentQueries = [...refSearchParams.current].reduce(
            (acc, [key, value]) => {
              acc[key] = value;
              return acc;
            },
            {} as Record<string, any>
          );

          const mergeQueries = { ...currentQueries, ...to };

          return refSetSearchParams.current(
            refineQueries(mergeQueries),
            option
          );
        }

        return refSetSearchParams.current(refineQueries(to), option);
      }

      return refNavigate.current(to, option);
    },
    []
  );

  return navigation;
}
