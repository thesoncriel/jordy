/**
 * 객체를 문자열 형태로 직렬화 한다.
 * 만약 값이 문자열이면 그 값 그대로 돌려준다.
 * @param value
 */
export declare function marshalJson(value: any): string;
/**
 * 특정 문자열의 내용을 확인하여 Object 로 만든다.
 * 첫문자와 마지막 문자를 비교하여 JSON 형태가 아니라면 string을 반환하며,
 * JSON 변환 시 문제가 발생된다면 null을 반환 한다.
 * 그 외 값이 유효하지 않을 경우, 들어온 raw 값을 그대로 반환 한다.
 * @param raw
 */
export declare function unmarshalJson(raw: string | null): unknown;
