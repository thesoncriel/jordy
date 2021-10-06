/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidateBulkOptionType,
  ValidateBulkResultModel,
  ValidateCheckModel,
  ValidateResultModel,
} from './validate.type';

function validateSingle<T>(
  val: T,
  item: ValidateCheckModel<T>
): ValidateResultModel {
  const result = item.check(val);
  const msg = !result ? item.message : '';

  return {
    result,
    message: msg,
  };
}

function _validateBulk<T>(
  val: T,
  opt: ValidateCheckModel<T> | ValidateCheckModel<T>[]
): ValidateResultModel {
  let mRes: ValidateResultModel | undefined;

  if (Array.isArray(opt)) {
    opt.every((_opt) => {
      const _mRes = validateSingle(val, _opt);

      if (!_mRes.result) {
        mRes = _mRes;
      }

      return _mRes.result;
    });
  } else {
    mRes = validateSingle(val, opt);
  }

  return (
    mRes || {
      result: true,
      message: '',
    }
  );
}

export function validate<T>(
  state: T,
  opt: ValidateBulkOptionType<T>
): ValidateBulkResultModel {
  const mRet: Record<string, ValidateResultModel> = {};
  const invalidKeys: string[] = [];
  const validKeys: string[] = [];
  const errorMessages: Record<string, string> = {};
  let isValid = true;
  let firstMessage = '';

  Object.keys(opt).forEach((key) => {
    const val = (state as any)[key];
    const items = (opt as any)[key];
    const _mRet = _validateBulk(val, items);

    mRet[key] = _mRet;
    isValid = isValid && _mRet.result;

    if (_mRet.result) {
      validKeys.push(key);
    } else {
      invalidKeys.push(key);
      errorMessages[key] = _mRet.message;

      if (!firstMessage) {
        firstMessage = _mRet.message;
      }
    }
  });

  return {
    isValid,
    results: mRet,
    validKeys,
    invalidKeys,
    errorMessages,
    firstMessage,
  };
}
