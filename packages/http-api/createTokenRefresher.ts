/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWTAuthTokenDto } from '../jwt';
import { TokenProvider } from '../storage';
import { qs } from '../util';
import { createHttpApi } from './createHttpApi.factory';
import { createHttpHeaderPipe } from './createHttpHeaderPipe';
import { HeaderFieldMakingOperator, HttpApi } from './network.type';

interface TokenRefresherConfig {
  /**
   * 수행 도메인 경로
   */
  baseUrl: string;
  /**
   * 리프레시 수행에 필요한 헤더를 만드는 오퍼레이터 함수들.
   *
   * bearer token 형태가 쓰인다면 `httpHeaderOperator.bearerToken` 를 사용하면 된다.
   *
   * 만약 다른 형태의 헤더라면 직접 구현하여 연결한다.
   */
  headerOperators: HeaderFieldMakingOperator[];
  /**
   * 실제 리프레시를 호출하여 토큰 자료를 제공하는곳.
   *
   * 인자로 들어오는 httpApi 를 이용하여 호출하고 응답값을 JWTAuthTokenDto 에 맞게 바꿔주어야 한다.
   *
   * @see HttpApi
   * @see JWTAuthTokenDto
   */
  mapper: (httpApi: HttpApi) => Promise<JWTAuthTokenDto>;
  /**
   * 쿼리 파라미터 이용 시 직렬화 할 유틸리티 함수.
   *
   * @default qs.serialize
   */
  paramsSerializer?: (params: any) => string;
  /**
   * CORS 사용시 요청 헤더에 관련 쿠키 정보를 포함시킬지 여부.
   *
   * @default false
   */
  withCredentials?: boolean;
}

class PassthroughTokenProvider implements TokenProvider {
  private token = '';

  get(): string {
    return this.token;
  }
  set(token: string): void {
    this.token = token;
  }
  clear(): void {
    this.token = '';
  }
}

/**
 * JWT 토큰을 리프레시 할 때 필요한 함수를 생성한다.
 *
 * @example
 * import { createTokenRefresher, httpHeaderOperator } from 'jordy';
 *
 * interface AuthTokenRes {
 *   access: string;
 *   refresh: string;
 * }
 *
 * const refresher = createTokenRefresher({
 *   baseUrl: 'https://api.jordy.com',
 *   headerOperators: [
 *     httpHeaderOperator.bearerToken,
 *   ],
 *   mapper: async (httpApi) => {
 *     const res = await httpApi.post<AuthTokenRes>('/token/refresh/path');
 *
 *     return {
 *       accessToken: res.access,
 *       refreshToken: res.refresh,
 *     };
 *   }
 * });
 *
 * const jwtProvider = createJWTProvider({
 *   accessTokenKey: 'myAccess',
 *   refreshTokenKey: 'myRefresh',
 *   tokenRefresher: refresher,
 * });
 *
 * @param param0
 * @returns
 */
export function createTokenRefresher({
  baseUrl,
  headerOperators,
  mapper,
  paramsSerializer = qs.serialize,
  withCredentials = false,
}: TokenRefresherConfig) {
  const provider = new PassthroughTokenProvider();
  const createHeaderProvider = () => {
    const pipe = createHttpHeaderPipe(provider);

    return pipe.apply(pipe, headerOperators);
  };

  const refreshTokenApi = createHttpApi(
    baseUrl,
    createHeaderProvider,
    paramsSerializer,
    withCredentials
  );

  return async function tokenRefresher(refreshToken: string) {
    provider.set(refreshToken);

    const result = await mapper(refreshTokenApi);

    return result;
  };
}
