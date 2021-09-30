/**
 * 특정 URL에서 파일명만 가져온다.
 * @param url 파일명을 가져오고싶은 경로
 */
export declare function getFileName(url: string): string;
/**
 * 특정 URL 에서 쿼리 파라미터를 객체 형태로 만들어준다.
 *
 * 경로에 쿼리 파라미터가 존재하지 않다면 단순 빈 배열을 반환한다.
 * @param url 파라미터를 가져오고 싶은 웹경로
 */
export declare function parseQueryString(url: string): Record<string, string>;
