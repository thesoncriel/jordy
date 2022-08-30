import {
  AnyAction,
  EnhancedStore,
  Middleware,
  MiddlewareArray,
} from '@reduxjs/toolkit';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { createStorage, StorageType } from '../storage';
import { useMakeDeps } from './useMakeDeps';
import { clearCacheByKeyword, createCacheKey } from './utils';

/**
 * query hooks가 리턴하는 객체
 */
interface QueryHandler<R, P = void, E extends Error = Error> {
  /**
   * 응답(response) 받은 자료가 담겨있다.
   *
   * 원격에서 자료를 받아오기 전까지는 설정된 기본 자료가 담겨있다.
   */
  data: R;
  /**
   * 오류 내용
   */
  error?: E;
  /**
   * 응답을 받아오는 중인지 여부
   */
  loading: boolean;
  /**
   * 응답을 위한 요청 수행 함수
   */
  load: (params?: P) => Promise<void>;
  /**
   * 현재 쿼리에 담긴 데이터를 초기화하고 기본 자료를 담는다.
   *
   * @param removeCache true (기본) = 캐시와 내부 상태 모두 초기화, false = 내부 상태만 초기화
   */
  clear: (removeCache?: boolean) => void;
}

interface QueryHooksCreatorSettingOptionDto<SR, SP, R, P, ReduxRootState> {
  /**
   * 쿼리 훅스 고유키. 캐시나 auto dispatch 사용 시 반드시 필요하다.
   *
   * ### auto dispatch
   * 매 요청 마다 redux store 의 dispatch 를 수행한다. (redux dev tool 에 해당 로그가 출력됨)
   */
  key?: string;
  /**
   * 캐시할 때 쓰일 서브키들을 설정한다.
   *
   * 들어오는 파라미터 객체에서 지정된 키만을 이용하여 캐시키를 만든다.
   *
   * **미 설정 시 기본 동작**: 들어오는 파라미터 객체의 _모든 키들을 대상_ 으로 동작된다.
   *
   * #### 해당 옵션이 무시되는 경우
   * - cache 옵션이 'false` 라면 무시된다.
   * - 들어오는 파라미터가 객체가 아니거나 비어있다면 해당 설정은 무시된다.
   */
  subKeysFromParams?: Array<keyof P>;
  /**
   * 캐시 종류 선택.
   *
   * key 옵션 설정 시 기본값이 자동으로 설정된다.
   *
   * false 를 주면 캐시를 사용하지 않는다.
   *
   * @default 'session'
   */
  cache?: StorageType | false;
  /**
   * 캐시 유효기간 설정. (seconds)
   *
   * 0 혹은 설정하지 않으면 기한이 없다.
   *
   * @default 0
   */
  expired?: number;
  /**
   * 게으른 수행(lazy fetch) 여부.
   *
   * true 로 설정 시 별도로 load 를 수행하지 않으면 데이터를 가져오지 않는다.
   *
   * @default false
   */
  lazy?: boolean;
  /**
   * 쿼리 훅스 수행과 동시에 곧바로 로딩으로 둘지의 여부.
   *
   * @default true
   */
  defaultLoading?: boolean;
  /**
   * 데이터 가져오기를 실제 수행 할 함수.
   */
  fetcher: ((params: SP) => Promise<SR>) | (() => Promise<SR>);
  /**
   * 적용할 기본자료.
   *
   * fetcher 가 자료를 가져오기 전 까지 기본적으로 제공 할 자료로 쓰인다.
   */
  defaultData: R | (() => R);
  /**
   * 파라미터 변환기.
   *
   * UI Model 로 전달된 파라미터를 Server 측 파라미터로 변환한다.
   */
  parameterConverter?: (params: P, getState: () => ReduxRootState) => SP;
  /**
   * 받아온 결과 데이터에 대한 변환기.
   *
   * Server 측 Entity 와 응답 자료를 UI Model 로 변환한다.
   */
  resultConverter?: (
    result: SR,
    getState: () => ReduxRootState,
    params: P
  ) => R;
}

interface QueryHooks<R, P = void, E extends Error = Error> {
  (params?: P): QueryHandler<R, P, E>;
}

interface CreateRepositoryQuery<S> {
  <SR, SP, R, P, E extends Error = Error>(
    config: QueryHooksCreatorSettingOptionDto<SR, SP, R, P, S>
  ): QueryHooks<R, P, E>;
  <R, P, E extends Error = Error>(
    config: QueryHooksCreatorSettingOptionDto<R, P, R, P, S>
  ): QueryHooks<R, P, E>;
}

function defConverter<P, R>(args: P) {
  return args as unknown as R;
}

export function buildQueryCreator<S>(
  store: EnhancedStore<S, AnyAction, MiddlewareArray<Middleware[]>>
): CreateRepositoryQuery<S> {
  const keyDic: Record<string, boolean> = {};

  /**
   * query hooks 를 만든다.
   *
   * 만들어진 hooks 는 react component 내부에서 쓰인다.
   *
   * @param {QueryHooksCreatorSettingOptionDto} option 쿼리훅스 설정값
   */
  return function createRepositoryQuery<
    SR,
    SP,
    R = SR,
    P = SP,
    E extends Error = Error
  >({
    key,
    subKeysFromParams,
    cache: cacheType = 'session',
    expired = 0,
    lazy = false,
    defaultLoading = false,
    fetcher,
    defaultData,
    parameterConverter = defConverter,
    resultConverter = defConverter,
  }: QueryHooksCreatorSettingOptionDto<SR, SP, R, P, S>) {
    if (key) {
      if (keyDic[key]) {
        console.warn(
          `Query hooks key "${key}" already exists. Please change the key`
        );
      }
      keyDic[key] = true;
    }
    const resultHooks: QueryHooks<R, P, E> = (requestParams?: P) => {
      const refFetching = useRef<boolean>(false);
      const [data, setData] = useState(defaultData);
      const [error, setError] = useState<E | undefined>(undefined);
      const [loading, setLoading] = useState(defaultLoading);
      const deps = useMakeDeps(requestParams, subKeysFromParams);

      const loader = useCallback(async (params?: P) => {
        if (refFetching.current) {
          return;
        }

        const sto =
          key && cacheType !== false
            ? createStorage<R>(
                cacheType,
                createCacheKey(key, params, subKeysFromParams),
                expired
              )
            : null;

        setError(undefined);

        if (sto) {
          const cachedValue = sto.get();

          if (cachedValue) {
            if (key) {
              store.dispatch({
                type: `QueryHooks/${key}/cached`,
                params,
                payload: cachedValue,
              });
            }
            setData(cachedValue);
            setLoading(false);

            return;
          }
        }

        refFetching.current = true;

        if (key) {
          store.dispatch({
            type: `QueryHooks/${key}/pending`,
            params,
          });
        }

        setLoading(true);

        const prm = fetcher(parameterConverter(params, store.getState));

        await prm
          .then((res) => {
            const convertedData = resultConverter(
              res,
              store.getState,
              params as P
            );

            if (key) {
              store.dispatch({
                type: `QueryHooks/${key}/fulfilled`,
                params,
                payload: convertedData,
              });
            }

            if (sto) {
              sto.set(convertedData);
            }

            setData(convertedData);
            setLoading(false);

            refFetching.current = false;
          })
          .catch((err) => {
            if (key) {
              store.dispatch({
                type: `QueryHooks/${key}/rejected`,
                params,
                payload: err,
              });
            }
            setError(err);
            setLoading(false);

            refFetching.current = false;
          });
      }, []);

      const clear = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        (removeCache: boolean = true) => {
          setData(defaultData);

          if (
            !removeCache ||
            !key ||
            cacheType === false ||
            cacheType === 'cookie'
          ) {
            return;
          }
          clearCacheByKeyword(cacheType, key);
        },
        [setData]
      );

      useLayoutEffect(() => {
        if (lazy) {
          return;
        }
        loader(requestParams);
      }, [...deps, lazy]);

      return {
        data,
        error,
        loading,
        load: loader,
        clear,
      };
    };

    return resultHooks;
  };
}
