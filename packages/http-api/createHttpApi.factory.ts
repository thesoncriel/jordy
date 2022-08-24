/* eslint-disable @typescript-eslint/no-explicit-any */
import { qs } from '../util';
import { AxiosHttpNetworkProvider } from './axios';
import { BasicHttpApi } from './BasicHttpApi';
import { HttpApi } from './network.type';
import { defaultHeaderCreator } from './network.util';

export function createHttpApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  paramsSerializer: (params: any) => string = qs.serialize,
  withCredentials = true
): HttpApi {
  return new BasicHttpApi(
    new AxiosHttpNetworkProvider(),
    baseUrl,
    headerCreator,
    paramsSerializer,
    withCredentials
  );
}
