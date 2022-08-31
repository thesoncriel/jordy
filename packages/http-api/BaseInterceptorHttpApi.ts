/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestErrorLike } from './HttpRestError';
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

      return (
        url +
        (url.includes('?') ? '&' : '?') +
        this.paramsSerializer(paramsAdditional)
      );
    }

    return url;
  };

  throwWithInterceptor = <E extends HttpRestErrorLike = any>(
    err: E
  ): Promise<any> => {
    if (this._interceptor.error) {
      const nextError = this._interceptor.error(err);

      if (nextError) {
        throw nextError;
      }
    }

    throw err;
  };
}
