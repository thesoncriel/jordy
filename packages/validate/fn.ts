import { isNullable } from '../util/typeCheck';

/**
 * 값이 비어있지 않은지 여부를 확인한다.
 * undefined, null 여부도 확인하며, 값이 'undefined', 'null' 이라는 문자열로 된 것인지도 확인 한다.
 *
 * @param val
 * @returns 비어있지 않다면 true, 아니면 false.
 */
function required(val: string) {
  return !isNullable(val) && !!val;
}

/**
 * 값의 길이를 확인한다.
 * 기본적으로 내부에 validEmpty 를 함께 수행 한다.
 * @param min 최소 길이
 * @param max 최대 길이
 */
const length = (min: number, max: number) => (val: string) =>
  required(val) && val.length >= min && val.length <= max;

/**
 * 이메일 유효성을 검증한다.
 * 좌측에 숫자/문자/ 언더바(_) 및 하이픈(-) 만 허용한다.
 * 내부적으로 validLength 를 수행하여 7~100 자 까지 인지를 함께 검증한다.
 * @param val
 */
function email(val: string) {
  return (
    length(7, 100)(val) && /^(\w|-|\.)+@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(val)
  );
}

/**
 * 비밀번호의 유효성을 체크한다. - 약한 버전 - -
 * 숫자, 영문 각각 1자 이상 포함되고
 * 총 길이가 6자~20자 까지 인지를 확인한다.
 * @param val
 */
function passwordWeak(val: string) {
  //  숫자, 영문 대/소문자 및 특수문자가 모두 최소 1자 이상 포함되고
  // return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,20})/).test(val);
  return /^(?=.*[A-z])(?=.*[0-9])(?=.{6,20})/.test(val);
}

/**
 * 비밀번호의 유효성을 체크한다. - 강력 버전 - -
 * 숫자, 영문 대/소문자 및 특수문자가 모두 최소 1자 이상 포함되고
 * 총 길이가 6자~32자 까지 인지를 확인한다.
 * @param val
 */
function password(val: string) {
  return /^(?=.*[A-z])(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])(?=.*[0-9]).{6,32}$/.test(
    val
  );
}

/**
 * 소문자가 존재하는지 체크한다.
 * @param val
 */
function lowercase(val: string) {
  return /^(?=.*[a-z])/.test(val);
}
/**
 * 대문자가 존재하는지 체크한다.
 * @param val
 */
function uppercase(val: string) {
  return /^(?=.*[A-Z])/.test(val);
}
/**
 * 숫자가 존재하는지 체크한다.
 * @param val
 */
function numbers(val: string) {
  return /^(?=.*\d)/.test(val);
}
/**
 * 특수문자가 존재하는지 체크한다.
 * @param val
 */
function symbols(val: string) {
  return /^(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])/.test(val);
}

/**
 * 한글 또는 영문으로 2글자 이상, 100글자 이하인지 확인한다.
 * @param val 확인할 값
 */
function korAndEng(val: string) {
  return /^([A-Za-z]|[가-힣]){2,100}$/.test(val);
}

/**
 * 번호 유효성을 체크 한다.
 * 값은 번호만 이뤄져 있어야 하며 앞이 0으로 채워져 있어도 유효하다.
 * @param val 확인할 값
 */
function numberOnly(val: string) {
  return /^[0-9]{1,}$/.test(val);
}

/**
 * 특정범위의 값인지 여부를 확인한다.
 * ```ts
 * const checker = validate.fn.range(10, 100);
 *
 * checker(50); // true
 * checker(9); // false
 * checker(101); // false
 * ```
 * @param min
 * @param max
 * @returns
 */
function range(min: number, max: number) {
  return function innerRange(val: string | number) {
    const num = Number(val);

    return num >= min && num <= max;
  };
}

/**
 * 전화번호 유효성을 체크 한다.
 *
 * 중간에 dash (-) 가 있어야 한다.
 * @param val 확인할 값
 */
function phoneWithDash(val: string) {
  return /^(\d{4}-\d{4}|\d{2,3}-\d{3,4}-\d{3,4})$/.test(val);
}

/**
 * 전화번호 유효성을 체크 한다.
 * 숫자로만 이뤄져 있어야하며, 최소 8자리, 최대 11자리 까지 허용 된다.
 *
 * @param val 확인할 값
 */
function phone(val: string) {
  return length(8, 11)(val) && numbers(val);
}

/**
 * 사업자 등록번호 유효성을 검증한다.
 * @param val
 */
function companyRegNumber(val: string) {
  return /^\d{3}-\d{2}-\d{5}$/.test(val);
}

export default {
  required,
  email,
  passwordWeak,
  password,
  lowercase,
  uppercase,
  numbers,
  symbols,
  korAndEng,
  numberOnly,
  range,
  phoneWithDash,
  phone,
  companyRegNumber,
  length,
};
