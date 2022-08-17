/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AsyncHttpUploadProvider,
  HttpUploadApi,
  UploadStateArgs,
} from './network.type';

export class BasicHttpUploadApi implements HttpUploadApi {
  constructor(
    private provider: AsyncHttpUploadProvider,
    private baseUrl: string,
    private headersCreator: () => Record<string, string>,
    private withCredentials = true
  ) {}
  postUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progressCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T> {
    return this.provider.post({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      data,
      timeout,
      onProgress: progressCallback,
    });
  }
  putUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progressCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T> {
    return this.provider.put({
      url: `${this.baseUrl}${url}`,
      headers: this.headersCreator(),
      withCredentials: this.withCredentials,
      data,
      timeout,
      onProgress: progressCallback,
    });
  }
}
