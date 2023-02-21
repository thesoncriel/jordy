import { isNullable, isObject } from './typeCheck';

function _serialize<T>(params: T, parentKey = '') {
  return Object.entries(params).reduce((acc, [oriKey, value]) => {
    const key = parentKey ? `${parentKey}%5B${oriKey}%5D` : oriKey;
    let ret = acc + (acc.length > 1 ? '&' : '');

    if (isObject(value)) {
      ret += _serialize(value, key);
    } else {
      ret =
        ret +
        key +
        '=' +
        encodeURIComponent(
          isNullable(value) || Number.isNaN(value) ? '' : value
        );
    }

    return ret;
  }, '');
}

const cache = new Map<string, Record<string, string>>();

/**
 * Query String 을 조작하는 유틸리티 모음
 */
interface QueryString {
  /**
   * 특정 URL 에서 쿼리 파라미터를 객체 형태로 만들어준다.
   *
   * 경로에 쿼리 파라미터가 존재하지 않다면 단순 빈 배열을 반환한다.
   * @param url 파라미터를 가져오고 싶은 웹경로
   */
  parse(url: string): Record<string, string>;

  /**
   * 전달되는 객체의 key 와 value 를 이용하여 쿼리 파라미터 문자열로 바꿔준다.
   * @param params
   * @param withQuestionMark
   * @returns
   */
  serialize<T = Record<string, unknown>>(
    params: T,
    withQuestionMark?: boolean
  ): string;
  /**
   * 검색 문자열 (search string) 에 지정된 자료로 쿼리 파라미터를 덧붙인다.
   * @param search "?"로 시작되는 search string
   * @param data 덧붙일 쿼리 파라미터가 될 객체
   * @throws "?"로 시작되지 않는 문자열일 경우 에러 발생
   * @returns
   */
  append(search: string, data: Record<string, unknown>): string;
}

/**
 * Query String 을 조작하는 유틸리티 모음.
 *
 * @description
 * 외부의 "qs" 라이브러리와는 관계가 없다.
 */
export const qs: QueryString = {
  parse(url: string) {
    if (cache.has(url)) {
      return cache.get(url);
    }
    cache.clear();

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
    cache.set(url, result);

    return result;
  },
  serialize<T = Record<string, unknown>>(params: T, withQuestionMark = false) {
    if (!isObject(params)) {
      throw new Error(
        `serializeToQueryString: params is not object.\n${
          params ? JSON.stringify(params) : params
        }`
      );
    }
    return (withQuestionMark === true ? '?' : '') + _serialize(params);
  },
  append(search: string, data: Record<string, unknown>) {
    if (!search) {
      return qs.serialize(data, true);
    }
    if (search.length >= 1 && search[0] === '?') {
      return `${search}&${qs.serialize(data)}`;
    }
    throw new Error(`qs.append : "${search}" is invalid search string.`);
  },
};
