import { AxiosResponse } from 'axios';
import { HttpApi, HttpApiErrorParser } from './network.type';
/**
 * Backend 에서 API를 호출하는 서비스를 생성한다.
 * @param baseUrl 현재 서비스에서 API 호출 시 필요한 도메인 및 하위 경로를 정의 한다.
 * @param headerProvider 헤더 제공자를 주입한다.
 * @param withCredentials cross-domain 의 cookie 값을 가져올지의 여부 설정. 기본 true.
 */
export declare const createHttpApi: (baseUrl: string, parserVisitor: HttpApiErrorParser<AxiosResponse>, headerProvider?: () => Record<string, string>, withCredentials?: boolean) => HttpApi;
