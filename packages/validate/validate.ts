/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidateBulkOptionType,
  ValidateBulkResultModel,
} from './validate.type';
import { validateSubUtils } from './validateSubUtils';

const { createValidateBulkResultModel, validateBulk } = validateSubUtils;

export function validate<T>(
  state: T,
  opt: ValidateBulkOptionType<T>
): ValidateBulkResultModel {
  return Object.keys(opt).reduce((acc, key) => {
    const val = (state as any)[key];
    const items = (opt as any)[key];
    const _mRet = validateBulk(val, items);

    acc.results[key] = _mRet;
    acc.isValid = acc.isValid && _mRet.result;

    if (_mRet.result) {
      acc.validKeys.push(key);
    } else {
      acc.invalidKeys.push(key);
      acc.errorMessages[key] = _mRet.message;

      if (!acc.firstMessage) {
        acc.firstMessage = _mRet.message;
      }
    }

    return acc;
  }, createValidateBulkResultModel());
}
