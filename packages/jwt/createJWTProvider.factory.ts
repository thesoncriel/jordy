import { createTokenProvider } from '../storage';
import { createAsyncQueue } from '../util/AsyncQueue';
import { JWTAuthTokenDto, JWTProvider } from './jwt.type';
import { RefreshableJWTProvider } from './RefreshableJWTProvider';

export function createJWTProvider(
  accessTokenKey: string,
  refreshTokenKey: string,
  tokenRefresher: (refreshToken: string) => Promise<JWTAuthTokenDto>
): JWTProvider {
  return new RefreshableJWTProvider(
    createTokenProvider('local', accessTokenKey),
    createTokenProvider('local', refreshTokenKey),
    createAsyncQueue(),
    tokenRefresher
  );
}
