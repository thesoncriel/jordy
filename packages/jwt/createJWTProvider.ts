import { createTokenProvider } from '../storage/createTokenProvider';
import { createAsyncQueue } from '../util/AsyncQueue';
import { JWTAuthTokenDto, JWTProvider } from './jwt.type';
import { RefreshableJWTProvider } from './RefreshableJWTProvider';

const DEFAULT_ACCESS_TOKEN_EXPIRED_TIME = 60 * 60;
const DEFAULT_REFRESH_TOKEN_EXPIRED_TIME = 60 * 60 * 24 * 14;

interface JWTProviderCreatorConfig {
  /**
   * 엑세스 토큰키
   */
  accessTokenKey: string;
  /**
   * 리프레시 토큰키
   */
  refreshTokenKey: string;
  /**
   * 엑세스 토큰 유효시간.
   *
   * 기본 1시간 (=3600초)
   */
  accessTokenExpiredTime?: number;
  /**
   * 리프레시 토큰 유효시간.
   *
   * 기본 2주 (=1,209,600초)
   */
  refreshTokenExpiredTime?: number;
  /**
   * 토큰을 새로 받아오는 로직
   */
  tokenRefresher: (refreshToken: string) => Promise<JWTAuthTokenDto>;
}

export function createJWTProvider({
  accessTokenKey,
  refreshTokenKey,
  accessTokenExpiredTime = DEFAULT_ACCESS_TOKEN_EXPIRED_TIME,
  refreshTokenExpiredTime = DEFAULT_REFRESH_TOKEN_EXPIRED_TIME,
  tokenRefresher,
}: JWTProviderCreatorConfig): JWTProvider {
  return new RefreshableJWTProvider(
    createTokenProvider('local', accessTokenKey, accessTokenExpiredTime),
    createTokenProvider('local', refreshTokenKey, refreshTokenExpiredTime),
    createAsyncQueue(),
    tokenRefresher
  );
}
