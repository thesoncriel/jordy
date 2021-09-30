import axios, { AxiosResponse, Method } from 'axios';
import {
  HttpApiErrorParser,
  UploadStateArgs,
  XhrUploadStateArgs,
} from './network.type';

export const axiosResponseToData = <T>(axiosRes: AxiosResponse<T>) =>
  axiosRes.data;

export function axiosCreateHeader(
  headerProvider: () => Record<string, string>
) {
  return {
    common: headerProvider(),
  };
}

export const throwNewErrorForLib =
  <T>(parserVisitor: HttpApiErrorParser<T>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (anyError: any): never => {
    const newError = parserVisitor.parse(anyError);

    return parserVisitor.interrupt(newError).then(() => {
      throw newError;
    }) as never;
  };

export const axiosUploadCommon =
  (
    baseUrl: string,
    parserVisitor: HttpApiErrorParser<AxiosResponse>,
    headerProvider: () => Record<string, string>,
    withCredentials = true
  ) =>
  <T>(
    method: Method,
    url: string,
    data: FormData,
    progCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ) => {
    try {
      const headers = axiosCreateHeader(headerProvider);
      const fnCatchCommon = throwNewErrorForLib(parserVisitor);

      return axios(baseUrl + url, {
        data,
        headers,
        method,
        onUploadProgress: ({ loaded, total }: XhrUploadStateArgs) => {
          const args = {
            completed: loaded >= total,
            loaded,
            progress: Math.floor((loaded * 1000) / total) / 10,
            total,
          };

          if (progCallback) {
            progCallback(args);
          }
        },
        withCredentials,
        timeout,
      })
        .then<T>(axiosResponseToData)
        .catch(fnCatchCommon);
    } catch (error) {
      return Promise.reject(error);
    }
  };

export function convertToFormData(
  data: Record<string, string | File | File[]>
) {
  const formData = new FormData();
  const keys = Object.keys(data);
  let key = '';

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];

    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      continue;
    }
    const value = data[key];

    if (Array.isArray(value)) {
      const len = value.length;
      for (let idx = 0; idx < len; idx++) {
        const file: File = value[idx];
        formData.append(key, file, file.name);
      }
    } else {
      formData.set(key, value);
    }
  }

  return formData;
}
