/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NavigateOptions,
  Path,
  To,
  useNavigate as useRcNavigate,
  useSearchParams,
} from 'react-router-dom';

import { isObject, isUndefined } from '../util';

type SearchParams = Record<string, any>;
type SearchParamsOptions = NavigateOptions & { merge?: boolean };

function instanceOfTo(to: unknown): to is Partial<Path> {
  return isObject(to) && ('pathname' in to || 'search' in to || 'hash' in to);
}

function instanceOfSearchParams(to: unknown): to is SearchParams {
  return !instanceOfTo(to) && isObject(to);
}

function isMergeQueries(option: SearchParamsOptions): boolean {
  return isUndefined(option) || (option && option['merge'] === true);
}

/**
 * react-router-dom v6의 useNavigate를 손쉽게 사용하기 위한 Adapter
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
export function useNavigate() {
  const [currentSearchParams, setSearchParams] = useSearchParams();
  const navigate = useRcNavigate();

  function navigation(to: To, option?: NavigateOptions): void;
  function navigation(delta: number): void;
  function navigation(
    searchParams: SearchParams,
    option?: SearchParamsOptions
  ): void;
  function navigation(
    to: To | number | SearchParams,
    option?: NavigateOptions | SearchParamsOptions
  ): void {
    if (typeof to === 'number') {
      return navigate(to);
    }

    if (typeof to === 'string') {
      return navigate(to, option);
    }

    if (instanceOfTo(to)) {
      return navigate(to, option);
    }

    if (instanceOfSearchParams(to)) {
      if (isMergeQueries(option)) {
        const currentQueries = [...currentSearchParams].reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, any>
        );

        return setSearchParams({ ...currentQueries, ...to }, option);
      }

      return setSearchParams(to, option);
    }

    return navigate(to, option);
  }

  return navigation;
}
