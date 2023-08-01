import { ValidateBulkResultUiState } from './validate.type';
import { validateSubUtils } from './validateSubUtils';

/**
 * 유효성 검증 결과 여러개를 하나의 결과로 병합한다.
 *
 * 병합후엔 하나의 {ValidateBulkResultUiState} 타입으로 만들어진다.
 *
 * @example
 * ```ts
 * const result: ValidateBulkResultUiState = mergeValidates(
 *   validate(dataA, { someAttr: val => isSomeCondition(val) }),
 *   validate(dataB, { otherProps: val => isMyCondition(val) }),
 *   validate(dataC, { anotherName: val => hasSomeValues(val) }),
 * );
 *
 * console.log(result.isValid); // 유효할 경우 true
 * ```
 *
 * @param args 하나로 만들 여러 유효성 검증 결과들.
 * @returns {ValidateBulkResultUiState}
 */
export function mergeValidates(
  ...args: ValidateBulkResultUiState[]
): ValidateBulkResultUiState {
  if (args.length === 1) {
    return args[0];
  }
  return args.reduce((acc, arg) => {
    acc.errorMessages = {
      ...acc.errorMessages,
      ...arg.errorMessages,
    };
    if (arg.firstMessage && !acc.firstMessage) {
      acc.firstMessage = arg.firstMessage;
    }
    Array.prototype.push.apply(acc.invalidKeys, arg.invalidKeys);

    acc.isValid = acc.isValid && arg.isValid;

    Array.prototype.push.apply(acc.validKeys, arg.validKeys);

    return acc;
  }, validateSubUtils.createValidateBulkResultUiState());
}
