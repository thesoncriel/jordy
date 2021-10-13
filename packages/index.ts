import { DeviceDetectProvider, withAdaptiveRender } from './adaptive-render';
import { useDebounce, useQueryParams } from './hooks';
import {
  createHttpApi,
  createHttpHeaderProvider,
  headerPipe,
  HttpApi,
  HttpApiErrorParser,
  UploadStateArgs,
  XhrUploadStateArgs,
} from './http-api';
import { cache } from './proxies';
import {
  createGuardDispatch,
  createGuardSelector,
  ModuleRouteModel,
  renderRouteSystem,
} from './route-system';
import { createStorage, createTokenProvider } from './storage';
import validate from './validate';

export * from './util';
export * from './types';
export {
  UploadStateArgs,
  XhrUploadStateArgs,
  HttpApiErrorParser,
  HttpApi,
  ModuleRouteModel,
  DeviceDetectProvider,
  withAdaptiveRender,
  useDebounce,
  useQueryParams,
  createHttpApi,
  headerPipe,
  createHttpHeaderProvider,
  cache,
  renderRouteSystem,
  createGuardDispatch,
  createGuardSelector,
  createStorage,
  createTokenProvider,
  validate,
};
