import { AxiosHttpUploadProvider } from './axios';
import { BasicHttpUploadApi } from './BasicHttpUploadApi';
import { defaultHeaderCreator } from './network.util';

export function createHttpUploadApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  withCredentials = true
) {
  return new BasicHttpUploadApi(
    new AxiosHttpUploadProvider(),
    baseUrl,
    headerCreator,
    withCredentials
  );
}
