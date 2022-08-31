/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpRestError,
  HttpRestErrorMetaArgs,
  RestHttpMethodType,
} from '../../types';
import { isAxiosError } from './axios.util';

function tryGetMethod(
  method: string | undefined
): RestHttpMethodType | undefined {
  try {
    return method.toLocaleLowerCase() as RestHttpMethodType;
  } catch (error) {
    return undefined;
  }
}

export function throwableAxiosErrorParser(error: any) {
  if (isAxiosError(error)) {
    const errorData = error.response?.data;
    const meta: HttpRestErrorMetaArgs = {
      url: error.config.url || '',
      method: tryGetMethod(error.config.method),
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
}
