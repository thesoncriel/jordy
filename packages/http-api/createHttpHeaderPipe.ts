/* eslint-disable no-param-reassign */
import { JWTProvider } from '../jwt';
import { TokenProvider } from '../storage';
import { isServer } from '../util/envCheck';
import { HttpRestError } from './HttpRestError';
import { HeaderFieldMakingOperator } from './network.type';

function makeHeaders(pipes: HeaderFieldMakingOperator[], token = '') {
  const rawMap = pipes.reduce(
    (prev, fn) => fn(prev, token),
    new Map<string, string>()
  );

  return Object.fromEntries(rawMap) as Record<string, string>;
}

const MSG_DEFAULT =
  '로그인 상태가 만료 되었습니다.\n다시 로그인 하여 주시기 바랍니다.';

/**
 * HTTP 헤더를 제공한다.
 *
 * tokenProvider 설정 후 operator 로 필요한 헤더 요소를 함수로 구성하여
 * 다양한 HTTP 헤더를 만들 수 있다.
 *
 * ```ts
 * import {
 *   createTokenProvider,
 *   createHttpHeaderPipe,
 *   httpHeaderOperator,
 * } from 'jordy';
 *
 * const tokenProvider = createTokenProvider('local', 'myValue');
 * const headerPipe = createHttpHeaderPipe(tokenProvider);
 * const headers = headerPipe(
 *   // 미리 제공된 오퍼레이터 사용
 *   httpHeaderOperator.contentTypeJson,
 *   httpHeaderOperator.bearerToken,
 *   // 직접 오퍼레이터 작성
 *   (data: Map<string, string>, token: string) => {
 *     data.set('its', 'my-life-' + token);
 *
 *     return data;
 *   },
 * );
 *
 * console.log(headers);
 * ```
 * ```json
 * {
 *   "Content-Type": "application/json; charset=utf-8",
 *   "Authorization": "Bearer some_token_value",
 *   "its": "my-life-some_token_value"
 * }
 * ```
 *
 * @param provider 토큰 제공자.
 * @return {Function} 오퍼레이터를 연속으로 사용하여 헤더 객체를 만드는 파이프 함수.
 * @see TokenProvider
 * @see JWTProvider
 */
export const createHttpHeaderPipe = (
  provider?: TokenProvider | JWTProvider,
  loginRequiredMessage = MSG_DEFAULT
) => {
  return async function headerPipe(...pipes: HeaderFieldMakingOperator[]) {
    let token = '';

    if (provider) {
      token = await provider.get();

      if (!token && !isServer()) {
        throw new HttpRestError(loginRequiredMessage, 'auth');
      }
    }

    return makeHeaders(pipes, token);
  };
};
