/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarshallingType } from '../types';
import { getFileName } from '../util';
import { AsyncHttpNetworkProvider, HttpApi } from './network.type';

export class BasicHttpApi implements HttpApi {
  constructor(
    private provider: AsyncHttpNetworkProvider,
    private baseUrl: string,
    private headersCreator: () => Record<string, string>,
    private paramsSerializer: (params: any) => string,
    private withCredentials = true
  ) {}
  get<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    params?: P,
    timeout?: number
  ): Promise<T> {
    return this.provider.get({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params,
      timeout,
    });
  }
  post<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    return this.provider.post({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params: body,
      timeout,
    });
  }
  put<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    return this.provider.put({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params: body,
      timeout,
    });
  }
  patch<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T> {
    return this.provider.patch({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params: body,
      timeout,
    });
  }
  delete<T = MarshallingType, P = void | Record<string, any>>(
    url: string,
    params?: P,
    timeout?: number
  ): Promise<T> {
    return this.provider.delete({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params,
      timeout,
    });
  }
  getFile<P = void | Record<string, any>>(
    url: string,
    params?: P,
    filename?: string
  ): Promise<File> {
    return this.getBlob(url, params).then((blob) => {
      return new File([blob], filename || getFileName(url));
    });
  }
  getBlob<P = void | Record<string, any>>(
    url: string,
    params?: P
  ): Promise<Blob> {
    return this.provider.getBlob({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      paramsSerializer: this.paramsSerializer,
      params,
    });
  }
}
