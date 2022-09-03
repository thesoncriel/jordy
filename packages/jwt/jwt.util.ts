import { JWTAuthTokenDto } from './jwt.type';
import { isUndefined, isString } from '../util/typeCheck';

function isOptionalString(value: unknown): value is undefined | string {
  if (isString(value)) {
    return true;
  }
  if (isUndefined(value)) {
    return true;
  }
  return false;
}

export function isJWTAuthTokenDto(value: unknown): value is JWTAuthTokenDto {
  const target = value as JWTAuthTokenDto;
  return Boolean(
    target &&
      target.accessToken &&
      target.refreshToken &&
      isOptionalString(target.accessTokenExpiredDate) &&
      isOptionalString(target.refreshTokenExpiredDate)
  );
}
