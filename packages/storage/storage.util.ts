import { JWTAuthTokenDto } from './storage.type';

export function isJWTAuthTokenDto(value: unknown): value is JWTAuthTokenDto {
  const target = value as JWTAuthTokenDto;
  return Boolean(
    target &&
      target.accessToken &&
      target.accessTokenExpiredDate &&
      target.refreshToken &&
      target.refreshTokenExpiredDate
  );
}
