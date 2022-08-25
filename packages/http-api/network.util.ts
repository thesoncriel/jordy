import { HttpRestError } from '../types';
import { isNumber, isObject, isString, isUndefined } from '../util/typeCheck';
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

export function convertToFormData(
  data: Record<string, string | File | File[]>
) {
  return Object.entries(data).reduce((formData, [key, value]) => {
    if (Array.isArray(value)) {
      return value.reduce((innerFormData, file) => {
        innerFormData.append(key, file, file.name);

        return innerFormData;
      }, formData);
    }
    if (typeof value === 'string') {
      formData.set(key, value);

      return formData;
    }

    formData.set(key, value, value.name);

    return formData;
  }, new FormData());
}

export function defaultHeaderCreator() {
  return Promise.resolve({} as Record<string, string>);
}
