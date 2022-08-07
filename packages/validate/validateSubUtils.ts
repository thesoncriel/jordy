import {
  ValidateBulkResultModel,
  ValidateCheckModel,
  ValidateResultModel,
} from './validate.type';

function createValidateBulkResultModel() {
  const result: ValidateBulkResultModel = {
    isValid: true,
    results: {},
    validKeys: [],
    invalidKeys: [],
    firstMessage: '',
    errorMessages: {},
  };
  return result;
}

function validateSingle<T>(
  val: T,
  { check, message }: ValidateCheckModel<T>
): ValidateResultModel {
  const result = check(val);
  const msg = !result ? message : '';

  return {
    result,
    message: msg,
  };
}

function checkIgnore<T>(
  ignore: undefined | boolean | ((val: T) => boolean),
  val: T
) {
  if (!ignore) {
    return false;
  }
  return ignore === true || ignore(val);
}

function createValidateResultModel(): ValidateResultModel {
  return {
    result: true,
    message: '',
  };
}

function validateBulk<T>(
  val: T,
  opt:
    | ValidateCheckModel<T>
    | ValidateCheckModel<T>[]
    | ((value: T) => ValidateBulkResultModel)
): ValidateResultModel {
  let mRes: ValidateResultModel | undefined;

  if (Array.isArray(opt)) {
    if (opt.length > 0 && checkIgnore(opt[0].ignore, val)) {
      return createValidateResultModel();
    }

    opt.every((_opt) => {
      const _mRes = validateSingle(val, _opt);

      if (!_mRes.result) {
        mRes = _mRes;
      }

      return _mRes.result;
    });
  } else if (typeof opt === 'function') {
    const tmpRes = opt(val);
    mRes = {
      result: tmpRes.isValid,
      message: tmpRes.firstMessage,
    };
  } else {
    if (checkIgnore(opt.ignore, val)) {
      return createValidateResultModel();
    }

    mRes = validateSingle(val, opt);
  }

  return mRes || createValidateResultModel();
}

export const validateSubUtils = {
  createValidateBulkResultModel,
  validateSingle,
  validateBulk,
  checkIgnore,
};
