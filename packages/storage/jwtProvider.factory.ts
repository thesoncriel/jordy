import { createAsyncQueue } from '../util/AsyncQueue';
import { RefreshableJWTProvider } from './RefreshableJWTProvider';
import { JWTAuthTokenDto, JWTProvider } from './storage.type';
import { createTokenProvider } from './tokenProvider.factory';

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
