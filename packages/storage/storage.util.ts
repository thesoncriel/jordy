import { isFunction, isString } from '../util';
import { JWTAuthTokenDto, JWTProvider, TokenProvider } from './storage.type';

export function isTokenProvider(val: unknown): val is TokenProvider {
  const target = val as TokenProvider;

  return (
    target &&
    isFunction(target.get) &&
    isFunction(target.set) &&
    isFunction(target.clear)
  );
}

function isBoolean(val: unknown): val is boolean {
  return val === true || val === false;
}

export function isJWTProvider(val: unknown): val is JWTProvider {
  const target = val as JWTProvider;

  return (
    isTokenProvider(val) &&
    isBoolean(target.refreshToken) &&
    isBoolean(target.pending) &&
    isString(target.accessToken) &&
    isString(target.refreshToken)
  );
}

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
