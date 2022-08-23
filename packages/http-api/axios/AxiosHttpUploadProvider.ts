import axios, { AxiosResponse } from 'axios';
import { ErrorParser } from '../ErrorParser.decorator';
import {
  AsyncHttpUploadConfig,
  AsyncHttpUploadProvider,
  UploadStateArgs,
  XhrUploadStateArgs,
} from '../network.type';
import { convertToFormData } from '../network.util';
import { throwableAxiosErrorParser } from './throwableAxiosErrorParser';

@ErrorParser(throwableAxiosErrorParser)
export class AxiosHttpUploadProvider implements AsyncHttpUploadProvider {
  private extractData<T>(axiosRes: AxiosResponse<T>) {
    return axiosRes.data;
  }
  private makeAxiosHeaders(headers: Record<string, string>) {
    return {
      common: headers,
    };
  }
  private handleDownloadProgressCurried =
    (onProgress: (args: UploadStateArgs) => void) =>
    ({ loaded, total }: XhrUploadStateArgs) =>
      onProgress({
        completed: loaded >= total,
        loaded,
        progress: Math.floor((loaded * 1000) / total) / 10,
        total,
      });

  private upload(
    method: 'POST' | 'PUT',
    {
      url,
      data,
      headers,
      withCredentials,
      timeout,
      onProgress,
    }: AsyncHttpUploadConfig
  ) {
    return axios(url, {
      method,
      data: convertToFormData(data),
      headers: this.makeAxiosHeaders(headers),
      withCredentials,
      timeout,
      onDownloadProgress: onProgress
        ? this.handleDownloadProgressCurried(onProgress)
        : undefined,
    }).then(this.extractData);
  }

  post<T>(config: AsyncHttpUploadConfig): Promise<T> {
    return this.upload('POST', config);
  }

  put<T>(config: AsyncHttpUploadConfig): Promise<T> {
    return this.upload('PUT', config);
  }
}
