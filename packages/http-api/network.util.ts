import { AxiosError } from 'axios';
import { HttpRestError } from '../types';
import { isObject, isString, isUndefined, isNumber } from '../util/typeCheck';
import { BaseAsyncHttpNetworkConfig } from './network.type';

function isOptionalBoolean(value: unknown): value is undefined | boolean {
  if (isUndefined(value)) {
    return true;
  }
  if (value === true || value === false) {
    return true;
  }
  return false;
}

function isOptionalNumber(value: unknown): value is undefined | number {
  if (isUndefined(value)) {
    return true;
  }
  if (isNumber(value)) {
    return true;
  }
  return false;
}

export function isBaseAsyncHttpNetworkConfig(
  value: unknown
): value is BaseAsyncHttpNetworkConfig {
  if (!value) {
    return false;
  }
  const target = value as Partial<BaseAsyncHttpNetworkConfig>;

  if (!target.url || isString(target.url) === false) {
    return false;
  }
  if (!target.headers || isObject(target.headers) === false) {
    return false;
  }
  if (isOptionalBoolean(target.withCredentials) === false) {
    return false;
  }
  if (isOptionalNumber(target.timeout) === false) {
    return false;
  }
  return true;
}

export function throwHttpRestError(error: unknown) {
  if (
    error &&
    (HttpRestError.isHttpRestErrorLike(error) ||
      HttpRestError.isErrorLike(error) ||
      typeof error === 'string')
  ) {
    throw HttpRestError.from(error);
  }

  throw new HttpRestError(HttpRestError.DEFAULT_MESSAGE, {
    url: '',
    status: 0,
    rawData: error,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAxiosError(error: any): error is AxiosError {
  return (
    error &&
    error.response &&
    typeof error.response.status === 'number' &&
    error.config &&
    typeof error.config.url === 'string'
  );
}
