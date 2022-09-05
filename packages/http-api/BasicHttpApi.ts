/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarshallingType } from '../types';
import { getFileName } from '../util';
import { BaseInterceptorHttpApi } from './BaseInterceptorHttpApi';
import { AsyncHttpNetworkProvider, InterceptorHttpApi } from './network.type';

export class BasicHttpApi
  extends BaseInterceptorHttpApi
  implements InterceptorHttpApi
{
  constructor(
    private provider: AsyncHttpNetworkProvider,
    private baseUrl: string,
    private headersCreator: () => Promise<Record<string, string>>,
    paramsSerializer: (params: any) => string,
    private withCredentials = false
  ) {
    super(paramsSerializer);
  }

  async get<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    params?: P,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.get({
        url: `${this.baseUrl}${url}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: this.mergeParams('get', url, params),
        timeout,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
  async post<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.post({
        url: `${this.baseUrl}${this.mergeQueries('post', url, body)}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: body,
        timeout,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
  async put<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.put({
        url: `${this.baseUrl}${this.mergeQueries('put', url, body)}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: body,
        timeout,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
  async patch<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.patch({
        url: `${this.baseUrl}${this.mergeQueries('patch', url, body)}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: body,
        timeout,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
  async delete<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.delete({
        url: `${this.baseUrl}${this.mergeQueries('delete', url, body)}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: body,
        timeout,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }

  getFile<P = void | Record<string, any>>(
    url: string,
    params?: P,
    filename?: string
  ): Promise<File> {
    return this.getBlob(url, params)
      .then((blob) => {
        return new File([blob], filename || getFileName(url));
      })
      .catch(this.throwWithInterceptor);
  }
  async getBlob<P = void | Record<string, any>>(
    url: string,
    params?: P
  ): Promise<Blob> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.getBlob({
        url: `${this.baseUrl}${url}`,
        headers,
        withCredentials: this.withCredentials,
        paramsSerializer: this.paramsSerializer,
        params: this.mergeParams('get', url, params),
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
}
