import axios, { AxiosResponse } from 'axios';
import { ErrorParser } from './ErrorParser.decorator';
import {
  AsyncHttpNetworkConfig,
  AsyncHttpNetworkProvider,
} from './network.type';
import { throwableAxiosErrorParser } from './throwableAxiosErrorParser';

@ErrorParser(throwableAxiosErrorParser)
export class AxiosHttpNetworkProvider implements AsyncHttpNetworkProvider {
  private extractData<T>(axiosRes: AxiosResponse<T>) {
    return axiosRes.data;
  }

  get<T>({ url, headers, ...config }: AsyncHttpNetworkConfig): Promise<T> {
    return axios
      .get<T>(url, {
        ...config,
        headers: {
          common: headers,
        },
      })
      .then(this.extractData);
  }

  post<T>({
    url,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios.post<T>(url, data, config).then(this.extractData);
  }

  put<T>({ url, params: data, ...config }: AsyncHttpNetworkConfig): Promise<T> {
    return axios.put<T>(url, data, config).then(this.extractData);
  }

  patch<T>({
    url,
    params: data,
    ...config
  }: AsyncHttpNetworkConfig): Promise<T> {
    return axios.patch<T>(url, data, config).then(this.extractData);
  }

  delete<T>({ url, ...config }: AsyncHttpNetworkConfig): Promise<T> {
    return axios.delete<T>(url, config).then(this.extractData);
  }

  getBlob({ url, ...config }: AsyncHttpNetworkConfig): Promise<Blob> {
    return axios
      .get<Blob>(url, {
        ...config,
        responseType: 'blob',
      })
      .then(this.extractData);
  }
}
