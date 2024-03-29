/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidateBulkOptionType,
  ValidateBulkResultUiState,
} from './validate.type';
import { validateSubUtils } from './validateSubUtils';

const { createValidateBulkResultUiState, validateBulk } = validateSubUtils;

/**
 * @description
 * 유효성 여부를 한번에 확인 한다.
 * 
 * @example
 * ```ts
 *  import { validate, validateFn } from 'jordy';
 * 
    interface UserUiState {
      name: string;
      phone: string;
      password: string;
    }

    function validateUserUiState(user: UserUiState) {
      const result = validate(user, {
        // 한가지 검증일 땐 객체로 넘겨준다.
        name: {
          // check 가 false 일 때 알려줄 메시지
          message: '이름을 채워주세요.',
          // 유효성 검사. 결과가 true 면 유효성이 검증된 것이다.
          check: val => validateFn.empty(val),
        },
        // phone 이 필수가 아니라면 생략한다.
        
        // 여러가지 형태를 검증하고 메시지를 다르게 주고 싶을 땐 배열로 넘겨준다.
        password: [
          {
            message: '비밀번호를 입력하세요',
            check: val => validateFn.empty(val),
          },
          {
            message: '비밀번호가 유효하지 않습니다.',
            check: val => validateFn.password(val),
          },
        ]
      });

      console.log(result.isValid); // true 면 모든 유효성 통과.
      console.log(result.firstMessage); // 검증 중 가장 첫번째로 나타난 에러 메시지
      console.log(result.results); // 각 필드별 결과
      // 자세한건 `ValidateBulkResultUiState` 참고
    }
 * ```
 * @param state 유효성 체크 할 값이 모여있는 객체.
 * @param opt 유효성 체크 옵션.
 * 
 * @see ValidateBulkResultUiState
 */
export function validate<T>(
  state: T,
  opt: ValidateBulkOptionType<T>
): ValidateBulkResultUiState {
  return Object.keys(opt).reduce((acc, key) => {
    const val = (state as any)[key];
    const items = (opt as any)[key];
    const _mRet = validateBulk(val, state, items);

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
  }, createValidateBulkResultUiState());
}
