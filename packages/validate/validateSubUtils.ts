import {
  ValidateBulkResultUiState,
  ValidateCheckUiState,
  ValidateResultUiState,
} from './validate.type';

function createValidateBulkResultUiState() {
  const result: ValidateBulkResultUiState = {
    isValid: true,
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
  { check, message }: ValidateCheckUiState<T, S>
): ValidateResultUiState {
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

function createValidateResultUiState(): ValidateResultUiState {
  return {
    result: true,
    message: '',
  };
}

function validateBulk<T, S>(
  val: T,
  state: S,
  opt:
    | ValidateCheckUiState<T, S>
    | ValidateCheckUiState<T, S>[]
    | ((value: T) => ValidateBulkResultUiState)
): ValidateResultUiState {
  let mRes: ValidateResultUiState | undefined;

  if (Array.isArray(opt)) {
    if (opt.length > 0 && checkIgnore(opt[0].ignore, val, state)) {
      return createValidateResultUiState();
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
      return createValidateResultUiState();
    }

    mRes = validateSingle(val, state, opt);
  }

  return mRes || createValidateResultUiState();
}

export const validateSubUtils = {
  createValidateBulkResultUiState,
  validateSingle,
  validateBulk,
  checkIgnore,
};
