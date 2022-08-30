import axios, { AxiosResponse } from 'axios';
import { ErrorParser } from '../ErrorParser.decorator';
import {
  AsyncHttpNetworkConfig,
  AsyncHttpNetworkProvider,
} from '../network.type';
import { throwableAxiosErrorParser } from './throwableAxiosErrorParser';

@ErrorParser(throwableAxiosErrorParser)
export class AxiosHttpNetworkProvider implements AsyncHttpNetworkProvider {
  private extractData<T>(axiosRes: AxiosResponse<T>) {
    return axiosRes.data;
  }
  private makeAxiosHeaders(headers: Record<string, string>) {
    return {
      common: headers,
    };
  }

  get<T>({ url, headers, ...config }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .get<T>(url, {
        ...config,
        headers: this.makeAxiosHeaders(headers),
      })
      .then(this.extractData);
  }

  post<T>({
    url,
    headers,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .post<T>(url, data, {
        ...config,
        headers: this.makeAxiosHeaders(headers),
      })
      .then(this.extractData);
  }

  put<T>({
    url,
    headers,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .put<T>(url, data, {
        ...config,
        headers: this.makeAxiosHeaders(headers),
      })
      .then(this.extractData);
  }

  patch<T>({
    url,
    headers,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .patch<T>(url, data, {
        ...config,
        headers: this.makeAxiosHeaders(headers),
      })
      .then(this.extractData);
  }

  delete<T>({
    url,
    headers,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .delete<T>(url, {
        ...config,
        data,
        headers: this.makeAxiosHeaders(headers),
      })
      .then(this.extractData);
  }

  getBlob({ url, headers, ...config }: AsyncHttpNetworkConfig): Promise<Blob> {
    return axios
      .get<Blob>(url, {
        ...config,
        headers: this.makeAxiosHeaders(headers),
        responseType: 'blob',
      })
      .then(this.extractData);
  }
}
