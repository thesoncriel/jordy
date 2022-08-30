/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInterceptorHttpApi } from './BaseInterceptorHttpApi';
import {
  AsyncHttpUploadProvider,
  InterceptorHttpUploadApi,
  UploadStateArgs,
} from './network.type';

export class BasicHttpUploadApi
  extends BaseInterceptorHttpApi
  implements InterceptorHttpUploadApi
{
  constructor(
    private provider: AsyncHttpUploadProvider,
    private baseUrl: string,
    private headersCreator: () => Promise<Record<string, string>>,
    paramsSerializer: (params: any) => string,
    private withCredentials = true
  ) {
    super(paramsSerializer);
  }

  async postUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progressCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.post({
        url: `${this.baseUrl}${this.mergeQueries('post', url, data)}`,
        headers,
        withCredentials: this.withCredentials,
        data,
        timeout,
        onProgress: progressCallback,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }

  async putUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progressCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T> {
    try {
      const headers = await this.headersCreator();

      return await this.provider.put({
        url: `${this.baseUrl}${this.mergeQueries('put', url, data)}`,
        headers,
        withCredentials: this.withCredentials,
        data,
        timeout,
        onProgress: progressCallback,
      });
    } catch (error) {
      this.throwWithInterceptor(error);
    }
  }
}
