import { AnyAction, EnhancedStore } from '@reduxjs/toolkit';
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { useCallback, useRef, useState } from 'react';

interface MutationHooksCreatorSettingOptionDto<SR, SP, R, P, ReduxRootState> {
  /**
   * Mutation hooks의 고유키이다. auto dispatch 사용 시 반드시 필요하다.
   *
   * ### auto dispatch
   * 매 요청마다 redux store의 dispatch를 수행한다. (devTool에 로그가 출력된다.)
   */
  key?: string;
  /**
   * 데이터 mutaion를 위한 함수
   */
  mutator: ((params: SP) => Promise<SR>) | ((params?: SP) => Promise<SR>);
  /**
   * 파라미터 변환기.
   *
   * UI State로 전달된 파라미터를 Server측 파라미터로 변환한다.
   */
  parameterConverter?: (params: P, getState: () => ReduxRootState) => SP;
  /**
   * 받아온 결과 데이터에 대한 변환기.
   *
   * Server측 Entity와 response를 UI State로 변환한다.
   */
  resultConverter?: (result: SR, getState: () => ReduxRootState) => R;
}

interface MutationResultType<R = void, P = void, E extends Error = Error> {
  data: R | null;
  error?: E;
  loading: boolean;
  mutate: (params?: P, throwable?: boolean) => Promise<boolean>;
}

interface MutationHooks<R = void, P = void, E extends Error = Error> {
  (params?: R): MutationResultType<R, P, E>;
}

function defineConverter<P, R>(args: P) {
  return args as unknown as R;
}

export function buildMutationCreator<S>(store: EnhancedStore<S>) {
  const thunkStore = store as EnhancedStore<
    S,
    AnyAction,
    [ThunkMiddlewareFor<S>]
  >;
  const keyDic: Record<string, boolean> = {};

  return function createRepositoryMutation<SR, SP, R, P, E extends Error>({
    key,
    mutator,
    parameterConverter = defineConverter,
    resultConverter = defineConverter,
  }: MutationHooksCreatorSettingOptionDto<SR, SP, R, P, S>) {
    if (key) {
      if (keyDic[key]) {
        console.warn(
          `Mutation hooks key "${key}" already exists. Please change the key.`
        );
      }
      keyDic[key] = true;
    }

    const resultHooks: MutationHooks<R, P, E> = (): MutationResultType<
      R,
      P,
      E
    > => {
      const refFetching = useRef<boolean>(false);
      const [data, setData] = useState<R | null>(null);
      const [error, setError] = useState<E | undefined>(undefined);
      const [loading, setLoading] = useState<boolean>(false);

      const mutate = useCallback(async (params?: P, throwable = false) => {
        if (refFetching.current) {
          if (throwable) {
            throw new Error('이미 수행 중입니다.');
          }

          return false;
        }

        setError(undefined);
        setLoading(true);

        refFetching.current = true;

        if (key) {
          thunkStore.dispatch({ type: `MutationHooks/${key}/pending`, params });
        }

        const prm = mutator(parameterConverter(params, thunkStore.getState));

        return await prm
          .then((res) => {
            const convertedData = resultConverter(res, thunkStore.getState);

            if (key) {
              thunkStore.dispatch({
                type: `MutationHooks/${key}/fulfilled`,
                params,
                payload: convertedData,
              });
            }

            setData(convertedData);
            setLoading(false);

            refFetching.current = false;

            return true;
          })

          .catch((err) => {
            if (key) {
              thunkStore.dispatch({
                type: `MutationHooks/${key}/rejected`,
                params,
                payload: err,
              });
            }

            setError(err);
            setLoading(false);

            refFetching.current = false;

            if (throwable) {
              throw err;
            }

            return false;
          });
      }, []);

      return {
        data,
        error,
        loading,
        mutate,
      };
    };

    return resultHooks;
  };
}
