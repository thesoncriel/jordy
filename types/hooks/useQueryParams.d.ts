/**
 * 훅: 웹브라우저의 URL 파라미터 및 쿼리 파라미터를 합쳐서 하나의 객체로 만들어준다.
 *
 * 주의1: 쿼리 및 URL 파라미터의 key name 이 중복되지 않는 조건에서 사용해야한다.
 *
 * @see useParams
 * @see parseQueryString
 */
export declare function useQueryParams<T = unknown>(): T;
/**
 * 훅: 웹브라우저의 URL 파라미터 및 쿼리 파라미터를 합쳐서 하나의 객체로 만들어준다.
 *
 * 주의1: 쿼리 및 URL 파라미터의 key name 이 중복되지 않는 조건에서 사용해야한다.
 *
 * @param selector 변환된 쿼리 파라미터 객체를 원하는 타입으로 직접 변환하는 셀렉터.
 * @see useParams
 * @see parseQueryString
 */
export declare function useQueryParams<T>(selector: (params: Record<string, string>) => T): T;
