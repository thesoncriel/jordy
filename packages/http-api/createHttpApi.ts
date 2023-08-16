/* eslint-disable @typescript-eslint/no-explicit-any */
import { qs } from '../util/queryString';
import { AxiosHttpNetworkProvider } from './axios/AxiosHttpNetworkProvider';
import { BasicHttpApi } from './BasicHttpApi';
import { InterceptorHttpApi } from './network.type';
import { defaultHeaderCreator } from './network.util';

const defSerialize = (params: any) => qs.serialize(params);

/**
 * HttpApi 를 생성한다.
 *
 * @param baseUrl API를 수행할 기본 도메인 경로
 * @param headerCreator 요청 헤더 생성자
 * @param paramsSerializer 파라미터 직렬화 함수. 기본 qs.serialize
 * @param withCredentials CORS 사용시 요청 헤더에 관련 쿠키 정보를 포함시킬지 여부. 기본 false
 * @returns
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
 */
export function createHttpApi(
  baseUrl: string,
  headerCreator: () => Promise<Record<string, string>> = defaultHeaderCreator,
  paramsSerializer: (params: any) => string = defSerialize,
  withCredentials = false
): InterceptorHttpApi {
  return new BasicHttpApi(
    new AxiosHttpNetworkProvider(),
    baseUrl,
    headerCreator,
    paramsSerializer,
    withCredentials
  );
}
