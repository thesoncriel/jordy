import { ComponentType } from 'react';
import { ModuleRouteModel } from './moduleRoute.model';
declare type GuardFunctionType = () => boolean | Promise<boolean>;
export declare const renderRouteSystem: (routes: ModuleRouteModel[], withSwitch?: boolean, notFound?: ComponentType<any>, guardList?: GuardFunctionType[]) => JSX.Element | JSX.Element[];
export {};
