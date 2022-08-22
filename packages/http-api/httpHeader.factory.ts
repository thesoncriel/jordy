/* eslint-disable no-param-reassign */
import { isServer } from '../util/envCheck';
import { JWTProvider, TokenProvider } from '../storage';
import { isJWTProvider, isTokenProvider } from '../storage/storage.util';

/**
 * 헤더 파이프.
 * 아래와 같은 데이터가 추가 된다.
 * Accept: 'application/json'
 * @param headerData 데이터를 추가 할 헤더
 */
const acceptContentType = (headerData: Record<string, string>) => {
  headerData.Accept = 'application/json';

  return headerData;
};

/**
 * 헤더 파이프.
 * 아래와 같은 데이터가 추가 된다.
 * Content-Type = 'application/x-www-form-urlencoded'
 * @param headerData 데이터를 추가 할 헤더
 */
const contentTypeFormPost = (headerData: Record<string, string>) => {
  headerData['Content-Type'] = 'application/x-www-form-urlencoded';

  return headerData;
};
/**
 * 헤더 파이프.
 * 아래와 같은 데이터가 추가 된다.
 * Content-Type = 'multipart/form-data'
 * @param headerData 데이터를 추가 할 헤더
 */
const contentTypeFormMultipart = (headerData: Record<string, string>) => {
  headerData['Content-Type'] = 'multipart/form-data';

  return headerData;
};
/**
 * 헤더 파이프.
 * 아래와 같은 데이터가 추가 된다.
 * Content-Type = 'application/json; charset=utf-8'
 * @param headerData 데이터를 추가 할 헤더
 */
const contentTypeJson = (headerData: Record<string, string>) => {
  headerData['Content-Type'] = 'application/json; charset=utf-8';

  return headerData;
};

/**
 * 헤더 파이프.
 * Bearer 토큰이 필요할 때 사용된다.
 * 전달된 토큰 값이 유효하지 않다면 키값을 생성하지 않는다.
 * @param headerData 데이터를 추가 할 헤더
 * @param token 사용될 베어러 토큰.
 */
const bearerToken = (headerData: Record<string, string>, token?: string) => {
  if (token) {
    headerData.Authorization = `Bearer ${token}`;
  }

  return headerData;
};

export const headerPipe = {
  acceptContentType,
  contentTypeFormPost,
  contentTypeFormMultipart,
  contentTypeJson,
  bearerToken,
};

type HeaderFieldMaker = (
  defHeader: Record<string, string>,
  token?: string
) => Record<string, string>;

/**
 * HTTP 헤더를 제공한다.
 * tokenProvider 설정 후 pipe 로 필요한 헤더 요소를 함수로 구성하여
 * 다양한 HTTP 헤더를 만들 수 있다.
 * @param provider 토큰을 보관하는 제공자.
 */
export const createHttpHeaderProvider =
  (provider?: TokenProvider | JWTProvider) =>
  async (...pipes: HeaderFieldMaker[]) => {
    let token = '';

    if (isJWTProvider(provider)) {
      token = await provider.get();
    } else if (isTokenProvider(provider)) {
      token = provider.get();

      if (!token && !isServer()) {
        throw new Error(
          '로그인 상태가 만료 되었습니다.\n다시 로그인 하여 주시기 바랍니다.'
        );
      }
    }

    return pipes.reduce((prev, fn) => fn(prev, token), {}) as Record<
      string,
      string
    >;
  };
