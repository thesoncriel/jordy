"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCompanyRegNumber = exports.validPhone = exports.validPhoneWithBar = exports.validNumberOnly = exports.validKorEng = exports.validJumin = exports.validSympols = exports.validNumbers = exports.validUpperCase = exports.validLowerCase = exports.validPassword = exports.validPasswordWeak = exports.validEmail = exports.validLengthCurried = exports.validEmpty = void 0;
var typeCheck_1 = require("../util/typeCheck");
function validEmpty(val) {
    return !(0, typeCheck_1.isNullable)(val) && !!val;
}
exports.validEmpty = validEmpty;
var validLengthCurried = function (min, max) { return function (val) {
    return validEmpty(val) && val.length >= min && val.length <= max;
}; };
exports.validLengthCurried = validLengthCurried;
function validEmail(val) {
    return ((0, exports.validLengthCurried)(7, 100)(val) &&
        /^(\w|-|\.)+@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(val));
}
exports.validEmail = validEmail;
function validPasswordWeak(val) {
    return /^(?=.*[A-z])(?=.*[0-9])(?=.{6,20})/.test(val);
}
exports.validPasswordWeak = validPasswordWeak;
function validPassword(val) {
    return /^(?=.*[A-z])(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])(?=.*[0-9]).{6,32}$/.test(val);
}
exports.validPassword = validPassword;
function validLowerCase(val) {
    return /^(?=.*[a-z])/.test(val);
}
exports.validLowerCase = validLowerCase;
function validUpperCase(val) {
    return /^(?=.*[A-Z])/.test(val);
}
exports.validUpperCase = validUpperCase;
function validNumbers(val) {
    return /^(?=.*\d)/.test(val);
}
exports.validNumbers = validNumbers;
function validSympols(val) {
    return /^(?=.*[~!@#$%^&*()\-=+_';<>/.`:"\\,[\]?|{}])/.test(val);
}
exports.validSympols = validSympols;
function validJumin(val) {
    return /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/.test(val);
}
exports.validJumin = validJumin;
function validKorEng(val) {
    return /^([A-Za-z]|[가-힣]){2,100}$/.test(val);
}
exports.validKorEng = validKorEng;
function validNumberOnly(val) {
    return !validEmpty(val) && /^\d{1,}$/.test(val);
}
exports.validNumberOnly = validNumberOnly;
function validPhoneWithBar(val) {
    return /^(\d{4}-\d{4}|\d{2,3}-\d{3,4}-\d{3,4})$/.test(val);
}
exports.validPhoneWithBar = validPhoneWithBar;
function validPhone(val) {
    return (0, exports.validLengthCurried)(8, 11)(val) && validNumbers(val);
}
exports.validPhone = validPhone;
function validCompanyRegNumber(val) {
    return /^\d{3}-\d{2}-\d{5}$/.test(val);
}
exports.validCompanyRegNumber = validCompanyRegNumber;
