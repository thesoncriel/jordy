/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestError, HttpRestErrorLike } from './HttpRestError';
import { HttpInterceptorConfig, RestHttpMethodType } from './network.type';

export class BaseInterceptorHttpApi {
  private _interceptor: HttpInterceptorConfig = {};
  public get interceptor(): HttpInterceptorConfig {
    return this._interceptor;
  }
  public set interceptor(value: HttpInterceptorConfig) {
    this._interceptor = value;
  }

  constructor(public paramsSerializer: (params: any) => string) {}

  mergeParams = <P>(
    method: RestHttpMethodType,
    url: string,
    paramsOriginal?: P
  ) => {
    if (this._interceptor.params) {
      const paramsAdditional = this._interceptor.params(
        method,
        url,
        paramsOriginal
      );

      if (paramsAdditional) {
        if (paramsOriginal) {
          return {
            ...paramsOriginal,
            ...paramsAdditional,
          };
        }
        return paramsAdditional;
      }
    }

    return paramsOriginal;
  };

  mergeQueries = <P>(
    method: RestHttpMethodType,
    url: string,
    paramsOriginal?: P
  ) => {
    if (this._interceptor.params) {
      const paramsAdditional = this._interceptor.params(
        method,
        url,
        paramsOriginal
      );

      if (!paramsAdditional) {
        return url;
      }

      const serializedParams = this.paramsSerializer(paramsAdditional);

      if (serializedParams[0] === '?') {
        return url + serializedParams;
      }

      return url + (url.includes('?') ? '&' : '?') + serializedParams;
    }

    return url;
  };

  throwWithInterceptor = <E extends HttpRestErrorLike = any>(
    err: E,
    method: RestHttpMethodType,
    url: string
  ): Promise<any> => {
    const refinedError = HttpRestError.withUrl(err, method, url);

    if (this._interceptor.error) {
      const nextError = this._interceptor.error(refinedError);

      if (nextError) {
        throw nextError;
      }
    }

    throw refinedError;
  };
}
