import { qs } from './queryString';

/**
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
 * 이거 대신 qs.parse 를 사용할 것.
 * @deprecated
 * @param url
 * @returns
 */
export function parseQueryString(url: string) {
  return qs.parse(url);
}

/**
 * 이거 대신 qs.serialize 를 사용할 것.
 * @deprecated
 * @param params
 * @param withQuestionMark
 * @returns
 */
export function serializeToQueryString<T = Record<string, unknown>>(
  params: T,
  withQuestionMark = false
) {
  return qs.serialize(params, withQuestionMark);
}
