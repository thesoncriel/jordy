import { EnhancedStore, AsyncThunkAction } from '@reduxjs/toolkit';
import { CombinedState } from 'redux';
export declare function createGuardDispatch<T>(store: EnhancedStore<CombinedState<T>>): <R>(effectResult: AsyncThunkAction<R, any, any>) => Promise<boolean>;
export declare function createGuardSelector<T>(store: EnhancedStore<CombinedState<T>>): <R>(selector: (state: CombinedState<T>) => R) => R;
