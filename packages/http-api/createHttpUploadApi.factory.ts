import { AxiosHttpUploadProvider } from './axios';
import { BasicHttpUploadApi } from './BasicHttpUploadApi';
import { HttpUploadApi } from './network.type';
import { defaultHeaderCreator } from './network.util';

export function createHttpUploadApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  withCredentials = true
): HttpUploadApi {
  return new BasicHttpUploadApi(
    new AxiosHttpUploadProvider(),
    baseUrl,
    headerCreator,
    withCredentials
  );
}
