/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 문자열에서 json 혹은 문자열로의 변환이 가능한 타입들을 나열한 것.
 * 문자열과 객체, 배열, 혹은 이들에서 파생된 형태의 타입들을 의미 한다.
 */
export type MarshallingType =
  | boolean
  | string
  | string[]
  | Record<string, any>
  | Array<Record<string, any>>;
