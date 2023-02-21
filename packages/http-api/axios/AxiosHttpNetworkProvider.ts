/* eslint-disable @typescript-eslint/no-explicit-any */
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

  get<T>({
    url,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .get<T, AxiosResponse<T, any>, any>(url, {
        ...config,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
      })
      .then(this.extractData);
  }

  post<T>({
    url,
    params: data,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .post<T, AxiosResponse<T, any>, any>(url, data, {
        ...config,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
      })
      .then(this.extractData);
  }

  put<T>({
    url,
    params: data,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .put<T, AxiosResponse<T, any>, any>(url, data, {
        ...config,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
      })
      .then(this.extractData);
  }

  patch<T>({
    url,
    params: data,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .patch<T, AxiosResponse<T, any>, any>(url, data, {
        ...config,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
      })
      .then(this.extractData);
  }

  delete<T>({
    url,
    params: data,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .delete<T, AxiosResponse<T, any>, any>(url, {
        ...config,
        data,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
      })
      .then(this.extractData);
  }

  getBlob({
    url,
    paramsSerializer,
    ...config
  }: AsyncHttpNetworkConfig): Promise<Blob> {
    return axios
      .get<Blob, AxiosResponse<Blob, any>, any>(url, {
        ...config,
        paramsSerializer: {
          serialize: paramsSerializer,
        },
        responseType: 'blob',
      })
      .then(this.extractData);
  }
}
