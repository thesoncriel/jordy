/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestError } from '../../types';
import { isAxiosError } from './axios.util';

export function throwableAxiosErrorParser(error: any) {
  if (isAxiosError(error)) {
    const axiosErr = error;
    const errorData = axiosErr.response?.data;
    const meta = {
      url: axiosErr.config.url || '',
      status: axiosErr.response?.status || 0,
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
