/**
 * 값이 비어있는지 여부를 확인한다.
 * undefined, null 여부도 확인하며, 값이 'undefined', 'null' 이라는 문자열로 된 것인지도 확인 한다.
 * @param val
 */
export declare function validEmpty(val: string): boolean;
/**
 * 값의 길이를 확인한다.
 * 기본적으로 내부에 validEmpty 를 함께 수행 한다.
 * @param min 최소 길이
 * @param max 최대 길이
 */
export declare const validLengthCurried: (min: number, max: number) => (val: string) => boolean;
/**
 * 이메일 유효성을 검증한다.
 * 좌측에 숫자/문자/ 언더바(_) 및 하이픈(-) 만 허용한다.
 * 내부적으로 validLength 를 수행하여 7~100 자 까지 인지를 함께 검증한다.
 * @param val
 */
export declare function validEmail(val: string): boolean;
/**
 * 비밀번호의 유효성을 체크한다. - 약한 버전 - -
 * 숫자, 영문 각각 1자 이상 포함되고
 * 총 길이가 6자~20자 까지 인지를 확인한다.
 * @param val
 */
export declare function validPasswordWeak(val: string): boolean;
/**
 * 비밀번호의 유효성을 체크한다. - 강력 버전 - -
 * 숫자, 영문 대/소문자 및 특수문자가 모두 최소 1자 이상 포함되고
 * 총 길이가 6자~32자 까지 인지를 확인한다.
 * @param val
 */
export declare function validPassword(val: string): boolean;
/**
 * 소문자가 존재하는지 체크한다.
 * @param val
 */
export declare function validLowerCase(val: string): boolean;
/**
 * 대문자가 존재하는지 체크한다.
 * @param val
 */
export declare function validUpperCase(val: string): boolean;
/**
 * 숫자가 존재하는지 체크한다.
 * @param val
 */
export declare function validNumbers(val: string): boolean;
/**
 * 특수문자가 존재하는지 체크한다.
 * @param val
 */
export declare function validSympols(val: string): boolean;
/**
 * 주민번호의 유효성을 체크한다.
 * @param val 체크할 주민번호
 */
export declare function validJumin(val: string): boolean;
/**
 * 한글 또는 영문으로 2글자 이상, 100글자 이하인지 확인한다.
 * @param val 확인할 값
 */
export declare function validKorEng(val: string): boolean;
/**
 * 번호 유효성을 체크 한다.
 * 값은 번호만 이뤄져 있어야 하며 앞이 0으로 채워져 있어도 유효하다.
 * @param val 확인할 값
 */
export declare function validNumberOnly(val: string): boolean;
/**
 * 전화번호 유효성을 체크 한다.
 *
 * 중간에 bar (-) 가 있어야 한다.
 * @param val 확인할 값
 */
export declare function validPhoneWithBar(val: string): boolean;
/**
 * 전화번호 유효성을 체크 한다.
 * 숫자로만 이뤄져 있어야하며, 최소 8자리, 최대 11자리 까지 허용 된다.
 *
 * 중간에 bar (-) 가 있어야 한다.
 * @param val 확인할 값
 */
export declare function validPhone(val: string): boolean;
/**
 * 사업자 등록번호 유효성을 검증한다.
 * @param val
 */
export declare function validCompanyRegNumber(val: string): boolean;
