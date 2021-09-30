import { isNullable } from '../util/typeCheck';
export function validEmpty(val) {
    return !isNullable(val) && !!val;
}
export var validLengthCurried = function (min, max) { return function (val) {
    return validEmpty(val) && val.length >= min && val.length <= max;
}; };
export function validEmail(val) {
    return (validLengthCurried(7, 100)(val) &&
        /^(\w|-|\.)+@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(val));
}
export function validPasswordWeak(val) {
    return /^(?=.*[A-z])(?=.*[0-9])(?=.{6,20})/.test(val);
}
export function validPassword(val) {
    return /^(?=.*[A-z])(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])(?=.*[0-9]).{6,32}$/.test(val);
}
export function validLowerCase(val) {
    return /^(?=.*[a-z])/.test(val);
}
export function validUpperCase(val) {
    return /^(?=.*[A-Z])/.test(val);
}
export function validNumbers(val) {
    return /^(?=.*\d)/.test(val);
}
export function validSympols(val) {
    return /^(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])/.test(val);
}
export function validJumin(val) {
    return /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/.test(val);
}
export function validKorEng(val) {
    return /^([A-Za-z]|[가-힣]){2,100}$/.test(val);
}
export function validNumberOnly(val) {
    return !validEmpty(val) && /^\d{1,}$/.test(val);
}
export function validPhoneWithBar(val) {
    return /^(\d{4}-\d{4}|\d{2,3}-\d{3,4}-\d{3,4})$/.test(val);
}
export function validPhone(val) {
    return validLengthCurried(8, 11)(val) && validNumbers(val);
}
export function validCompanyRegNumber(val) {
    return /^\d{3}-\d{2}-\d{5}$/.test(val);
}
