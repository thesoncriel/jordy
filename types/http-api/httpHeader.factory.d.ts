import { TokenProvider } from '../storage';
export declare const headerPipe: {
    acceptContentType: (headerData: Record<string, string>) => Record<string, string>;
    contentTypeFormPost: (headerData: Record<string, string>) => Record<string, string>;
    contentTypeFormMultipart: (headerData: Record<string, string>) => Record<string, string>;
    contentTypeJson: (headerData: Record<string, string>) => Record<string, string>;
    bearerToken: (headerData: Record<string, string>, token?: string) => Record<string, string>;
};
/**
 * HTTP 헤더를 제공한다.
 * tokenProvider 설정 후 pipe 로 필요한 헤더 요소를 함수로 구성하여
 * 다양한 HTTP 헤더를 만들 수 있다.
 * @param tokenProvider 토큰을 보관하는 제공자.
 */
export declare const createHttpHeaderProvider: (tokenProvider?: TokenProvider) => (...pipes: ((defHeader: Record<string, string>, token?: string) => Record<string, string>)[]) => Record<string, string>;
