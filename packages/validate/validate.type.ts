/**
 * 유효성 검사 결과 데이터.
 */
export interface ValidateResultModel {
  /**
   * 유효성 체크 결과.
   * true면 통과, false 면 통과 못했음
   */
  result: boolean;
  /**
   * 사용자에게 보여줄 메시지.
   * result 가 false 일 때만 값이 포함되어 있다.
   */
  message: string;
}

/**
 * 오류 메시지가 모여진 데이터.
 *
 * 스토어 상태에 에러 메시지 항목을 추가 할 때 쓰인다.
 */
export interface ErrorMessagesModel {
  /**
   * 휴효하지 못했던 키와 그에 대한 메시지를 모아둔 자료.
   *
   * KVP 로써 지정된 필드에 값이 없다면 에러가 아닌 것으로 간주될 수 있다.
   *
   * reducer 에 곧바로 응용할 때 유용하다.
   */
  errorMessages: Record<string, string>;
}

/**
 * 유효성 여부를 한번에 확인 후 받아볼 수 있는 결과 데이터
 */
export interface ValidateBulkResultModel extends ErrorMessagesModel {
  /**
   * 전체 유효성 검증 통과 여부. true 면 통과, false 면 아님
   */
  isValid: boolean;
  /**
   * 각 필드별 결과. key 로 접근할 수 있다.
   */
  results: Record<string, ValidateResultModel>;
  /**
   * 유효했던 키 목록
   */
  validKeys: string[];
  /**
   * 유효성 실패된 키 목록
   */
  invalidKeys: string[];
  /**
   * 여러 유효성 메시지 중 가장 첫번째 것을 담고 있다.
   */
  firstMessage: string;
}

/**
 * 유효성 체크 요청에 쓰이는 모델.
 */
export interface ValidateCheckModel<T> {
  /**
   * 해당 유효성 체크를 무시하는 조건.
   *
   * 설정하여 그 결과값이 true 라면 해당 필드의 모든 유효성 체크를 무시한다.
   *
   * 설정 시 가장 첫번째 유효성 체크 설정에만 유효하다.
   */
  ignore?: (val: T) => boolean;
  /**
   * 유효성 체크에 실패 했을 때 출력될 메시지
   */
  message: string;
  /**
   * 유효성 체크 수행 함수.
   *
   * 결과가 false 면 유효성 체크에 실패 한 것으로 간주한다.
   */
  check: (val: T) => boolean;
}

/**
 * 유효성 체크를 한번에 실시 할 때 쓰이는 모델. key : value 로 이뤄져 있다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidateBulkOptionType<T extends Record<string, any>> = {
  /**
   * 유효성 체크에 쓰이는 키, 메시지와 체크 함수 내용.
   *
   * 유효성 통과 못했을 때 알려줄 메시지를 key 로, 유효서 검사를 할 함수를 value 로 가진다.
   *
   * 순차적으로 검사 중 유효성 통과를 못하면 뒤이은 내용은 검사하지 않는다.
   *
   * 또 한 각 필드의 ignore 가 true 일 경우 그 필드 내 다음 조건은 무시하고 통과 된 것으로 간주한다.
   */
  [key in keyof T]?:
    | ValidateCheckModel<T[key]>
    | ValidateCheckModel<T[key]>[]
    | ((value: T[key]) => ValidateBulkResultModel);
};
