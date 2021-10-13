/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import { MarshallingType } from '../types';
import { getFileName } from '../util';
import { HttpApi, HttpApiErrorParser, UploadStateArgs } from './network.type';
import {
  axiosCreateHeader,
  axiosResponseToData,
  axiosUploadCommon as uploadCommon,
  convertToFormData,
  throwNewErrorForLib,
} from './networkParser';

/**
 * Backend 에서 API를 호출하는 서비스를 생성한다.
 * @param baseUrl 현재 서비스에서 API 호출 시 필요한 도메인 및 하위 경로를 정의 한다.
 * @param headerProvider 헤더 제공자를 주입한다.
 * @param withCredentials cross-domain 의 cookie 값을 가져올지의 여부 설정. 기본 true.
 */
export const createHttpApi = (
  baseUrl: string,
  parserVisitor: HttpApiErrorParser<AxiosError>,
  headerProvider: () => Record<string, string> = () => ({}),
  withCredentials = true
): HttpApi => {
  const fnUploadCommon = uploadCommon(
    baseUrl,
    parserVisitor,
    headerProvider,
    withCredentials
  );
  const fnCatchCommon = throwNewErrorForLib<AxiosError>(parserVisitor);
  const fnExceptCommon = parserVisitor.throwOther;

  return {
    delete<T, P>(url: string, params?: P, timeout?: number): Promise<T> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .delete<T>(`${baseUrl}${url}`, {
            headers,
            params,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    get<T = MarshallingType, P = Record<string, any> | void>(
      url: string,
      params?: P,
      timeout?: number
    ): Promise<T> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .get<T>(`${baseUrl}${url}`, {
            headers,
            params,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    getFile<P = Record<string, any> | void>(
      url: string,
      params?: P,
      filename?: string
    ): Promise<File> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .get<Blob>(baseUrl + url, {
            headers,
            params,
            responseType: 'blob',
            withCredentials,
          })
          .then(axiosResponseToData)
          .then((blob) => new File([blob], filename || getFileName(url)))
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    getBlob<P = Record<string, any> | void>(
      url: string,
      params?: P
    ): Promise<Blob> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .get<Blob>(baseUrl + url, {
            headers,
            params,
            responseType: 'blob',
            withCredentials,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    post<T>(url: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .post<T>(baseUrl + url, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    postUpload<
      T = void,
      P extends Record<string, any> = Record<string, string | File | File[]>
    >(
      url: string,
      data: P,
      progCallback?: (args: UploadStateArgs) => void,
      timeout?: number
    ): Promise<T> {
      return fnUploadCommon(
        'post',
        url,
        convertToFormData(data),
        progCallback,
        timeout
      );
    },
    put<T>(url: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .put<T>(baseUrl + url, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
    putUpload<
      T = void,
      P extends Record<string, any> = Record<string, string | File | File[]>
    >(
      url: string,
      data: P,
      progCallback?: (args: UploadStateArgs) => void,
      timeout?: number
    ): Promise<T> {
      return fnUploadCommon(
        'put',
        url,
        convertToFormData(data),
        progCallback,
        timeout
      );
    },
    patch<T>(url: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = axiosCreateHeader(headerProvider);

        return axios
          .patch<T>(baseUrl + url, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(fnCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(fnExceptCommon);
      }
    },
  };
};
