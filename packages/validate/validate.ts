import {
  ValidateBulkOptionType,
  ValidateBulkResultModel,
  ValidateCheckModel,
  ValidateResultModel,
} from './validate.type';
/* eslint-disable @typescript-eslint/no-explicit-any */

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

/**
 * @description
 * 유효성 여부를 한번에 확인 한다.
 * 
 * @example
 * ```ts
    interface UserModel {
      name: string;
      phone: string;
      password: string;
    }

    function execValidation(user: UserModel) {
      const result = validate(user, {
        // 한가지 검증일 땐 객체로 넘겨준다.
        name: {
          // check 가 false 일 때 알려줄 메시지
          message: '이름을 채워주세요.',
          // 유효성 검사. 결과가 true 면 유효성이 검증된 것이다.
          check: val => validEmpty(val),
        },
        // phone 이 필수가 아니라면 생략한다.
        
        // 여러가지 형태를 검증하고 메시지를 다르게 주고 싶을 땐 배열로 넘겨준다.
        password: [
          {
            message: '비밀번호를 입력하세요',
            check: val => validEmpty(val),
          },
          {
            message: '비밀번호가 유효하지 않습니다.',
            check: val => validPassword(val),
          },
        ]
      });

      console.log(result.isValid); // true 면 모든 유효성 통과.
      console.log(result.firstMessage); // 검증 중 가장 첫번째로 나타난 에러 메시지
      console.log(result.results); // 각 필드별 결과
      // 자세한건 `ValidateBulkResultModel` 참고
    }
 * ```
 * @param state 유효성 체크 할 값이 모여있는 객체.
 * @param opt 유효성 체크 옵션.
 * 
 * @see ValidateBulkResultModel
 */
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
