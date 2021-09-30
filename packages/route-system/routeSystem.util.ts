import {
  EnhancedStore,
  AsyncThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { CombinedState, AnyAction } from 'redux';

export function createGuardDispatch<T>(store: EnhancedStore<CombinedState<T>>) {
  return async function guardDispatch<R>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effectResult: AsyncThunkAction<R, any, any>
  ) {
    const dispatch = store.dispatch as typeof store.dispatch &
      ThunkDispatch<CombinedState<T>, null, AnyAction>;

    const action = await dispatch(effectResult);

    return action.meta.requestStatus === 'fulfilled';
  };
}

export function createGuardSelector<T>(store: EnhancedStore<CombinedState<T>>) {
  return function guardSelector<R>(selector: (state: CombinedState<T>) => R) {
    return selector(store.getState());
  };
}
