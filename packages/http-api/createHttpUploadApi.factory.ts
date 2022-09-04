/* eslint-disable @typescript-eslint/no-explicit-any */
import { qs } from '../util';
import { AxiosHttpUploadProvider } from './axios';
import { BasicHttpUploadApi } from './BasicHttpUploadApi';
import { InterceptorHttpUploadApi } from './network.type';
import { defaultHeaderCreator } from './network.util';

/**
 * HttpUploadApi 를 생성한다.
 *
 * 업로드 전용.
 *
 * @param baseUrl API를 수행할 기본 도메인 경로
 * @param headerCreator 요청 헤더 생성자
 * @param paramsSerializer 파라미터 직렬화 함수. 기본 qs.serialize
 * @param withCredentials CORS 사용시 요청 헤더에 관련 쿠키 정보를 포함시킬지 여부. 기본 false
 * @returns
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
 */
export function createHttpUploadApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  paramsSerializer: (params: any) => string = qs.serialize,
  withCredentials = false
): InterceptorHttpUploadApi {
  return new BasicHttpUploadApi(
    new AxiosHttpUploadProvider(),
    baseUrl,
    headerCreator,
    paramsSerializer,
    withCredentials
  );
}
