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

function validateSingle<T, S>(
  val: T,
  state: S,
  { check, message }: ValidateCheckModel<T, S>
): ValidateResultModel {
  const result = check(val, state);
  const msg = !result ? message : '';

  return {
    result,
    message: msg,
  };
}

function checkIgnore<T, S>(
  ignore: undefined | boolean | ((val: T, state: S) => boolean),
  val: T,
  state: S
) {
  if (!ignore) {
    return false;
  }
  return ignore === true || ignore(val, state);
}

function createValidateResultModel(): ValidateResultModel {
  return {
    result: true,
    message: '',
  };
}

function validateBulk<T, S>(
  val: T,
  state: S,
  opt:
    | ValidateCheckModel<T, S>
    | ValidateCheckModel<T, S>[]
    | ((value: T) => ValidateBulkResultModel)
): ValidateResultModel {
  let mRes: ValidateResultModel | undefined;

  if (Array.isArray(opt)) {
    if (opt.length > 0 && checkIgnore(opt[0].ignore, val, state)) {
      return createValidateResultModel();
    }

    opt.every((_opt) => {
      const _mRes = validateSingle(val, state, _opt);

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
    if (checkIgnore(opt.ignore, val, state)) {
      return createValidateResultModel();
    }

    mRes = validateSingle(val, state, opt);
  }

  return mRes || createValidateResultModel();
}

export const validateSubUtils = {
  createValidateBulkResultModel,
  validateSingle,
  validateBulk,
  checkIgnore,
};
