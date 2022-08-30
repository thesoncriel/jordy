/* eslint-disable @typescript-eslint/no-explicit-any */
import { qs } from '../util';
import { AxiosHttpUploadProvider } from './axios';
import { BasicHttpUploadApi } from './BasicHttpUploadApi';
import { InterceptorHttpUploadApi } from './network.type';
import { defaultHeaderCreator } from './network.util';

export function createHttpUploadApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  paramsSerializer: (params: any) => string = qs.serialize,
  withCredentials = true
): InterceptorHttpUploadApi {
  return new BasicHttpUploadApi(
    new AxiosHttpUploadProvider(),
    baseUrl,
    headerCreator,
    paramsSerializer,
    withCredentials
  );
}
