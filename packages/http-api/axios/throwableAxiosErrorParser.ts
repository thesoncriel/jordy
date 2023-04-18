/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestErrorMetaArgs, HttpRestError } from '../HttpRestError';
import { RestHttpMethodType } from '../network.type';
import { isAxiosError } from './axios.util';

function tryGetMethod(
  method: string | undefined,
  def: RestHttpMethodType
): RestHttpMethodType {
  try {
    return (method.toLocaleLowerCase() || def) as RestHttpMethodType;
  } catch (error) {
    return def;
  }
}

export function throwableAxiosErrorParser(
  error: any,
  method: RestHttpMethodType,
  url: string
) {
  if (isAxiosError(error)) {
    const errorData = error.response?.data;
    const meta: HttpRestErrorMetaArgs = {
      url: error.config.url || url,
      method: tryGetMethod(error.config.method, method),
      status: Number(error.response?.status || 0),
      rawData: errorData,
    };

    if (HttpRestError.isErrorLike(errorData)) {
      throw new HttpRestError(errorData.message, meta);
    }
    if (typeof errorData === 'string' && errorData) {
      if (errorData.substring(0, 200).toLowerCase().includes('<html')) {
        throw new HttpRestError(HttpRestError.DEFAULT_MESSAGE, meta);
      }
      throw new HttpRestError(errorData, meta);
    }

    throw new HttpRestError(HttpRestError.DEFAULT_MESSAGE, meta);
  }

  if (method && url) {
    if (HttpRestError.isHttpRestErrorLike(error)) {
      throw new HttpRestError(error.message, {
        method: error.method || method,
        url: error.url || url,
        status: HttpRestError.toStatusCodeFrom(error.errorType),
        errorType: error.errorType,
        rawData: error.rawData,
      });
    }

    const meta = {
      method,
      url,
      status: 0,
      rawData: error,
    };

    if (HttpRestError.isErrorLike(error)) {
      throw new HttpRestError(error.message, meta);
    }

    throw new HttpRestError(HttpRestError.DEFAULT_MESSAGE, meta);
  }
}
