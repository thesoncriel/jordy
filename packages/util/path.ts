import { isObject } from './typeCheck';

/**
import { isObject } from './typeCheck';
 * 특정 URL에서 파일명만 가져온다.
 * @param url 파일명을 가져오고싶은 경로
 */
export function getFileName(url: string) {
  try {
    return url.substring(url.lastIndexOf('/') + 1).split('?')[0];
  } catch (error) {
    return url;
  }
}

/**
 * 특정 URL 에서 쿼리 파라미터를 객체 형태로 만들어준다.
 *
 * 경로에 쿼리 파라미터가 존재하지 않다면 단순 빈 배열을 반환한다.
 * @param url 파라미터를 가져오고 싶은 웹경로
 */
export function parseQueryString(url: string) {
  const result: Record<string, string> = {};

  try {
    const queryString = url.split('?')[1];
    const splittedQueries = queryString.split('&');
    const len = splittedQueries.length;
    let key = '';
    let value = '';

    for (let i = 0; i < len; i++) {
      [key, value] = splittedQueries[i].split('=');

      result[key] = decodeURIComponent(value);
    }
  } catch (error) {
    //
  }

  return result;
}

/**
 * 전달되는 객체의 key 와 value 를 이용하여 쿼리 파라미터 문자열로 바꿔준다.
 * @param params
 * @param withQuestionMark
 * @returns
 */
export function serializeToQueryString<T = Record<string, unknown>>(
  params: T,
  withQuestionMark = false
) {
  if (!isObject(params)) {
    throw new Error(
      `serializeToQueryString: params is not object.\n${
        params ? JSON.stringify(params) : params
      }`
    );
  }
  return withQuestionMark
    ? '?'
    : '' +
        Object.entries(params).reduce((acc, [key, value]) => {
          return (
            acc +
            (acc.length > 1 ? '&' : '') +
            key +
            '=' +
            encodeURIComponent(value)
          );
        }, '');
}
