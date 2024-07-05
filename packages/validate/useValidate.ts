/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { focusByNames } from '../util/etc';
import {
  AntdFormItemValidationMessageDto,
  ValidateBulkResultUiState,
} from './validate.type';
import { validateSubUtils } from './validateSubUtils';

interface FieldDispatch<T> {
  (name: keyof T, value: any): void;
  (name: string, value: any): void;
  (next: Partial<T>): void;
  (setter: (prev: T) => Partial<T>): void;
}

interface MessageDispatch<T> {
  (name: keyof T, message: string): void;
  (messageDic: Partial<{ [key in keyof T]: string }>): void;
}

interface ValidateHookResult<T> {
  /**
   * 사용될 상태값.
   */
  state: T;
  /**
   * 각 상태 항목별 오류 메시지가 담긴 객체.
   */
  errorMessage: Partial<Record<keyof T, string>>;
  /**
   * 특정 필드의 상태값을 바꾼다.
   *
   * 변경된 필드명에 대응되는 오류 메시지는 자동으로 빈값으로 초기화된다.
   */
  setField: FieldDispatch<T>;
  /**
   * 특정 필드의 메시지값을 바꾼다.
   */
  setMessage: MessageDispatch<T>;
  /**
   * 현재 지정된 오류 메시지를 모두 빈값으로 초기화한다.
   */
  clearMessage(): void;
  /**
   * 메시지와 상태값을 모두 초기 상태로 되돌린다.
   */
  reset(): void;
  /**
   * 설정된 내부 상태값을 기반으로 유효성 검증을 수행한다.
   *
   * 검증에 실패했을 경우, 발생된 에러 메시지를 모두 `message` 필드에 자동으로 반영한다.
   */
  validate(): ValidateBulkResultUiState;
  /**
   * 처음 오류가 발생된 입력 요소에 포커스를 준다.
   */
  focusAtFirstError(): void;
  /**
   * antd 에서 Form.Item 과 응용할 때 쓰인다.
   * @example
   * ```tsx
   * const { state, setField, getAntdStatus } = useValidate({ name: '' });
   *
   * <Form.Item {...getAntdStatus('name')}>
   *   <Input
   *     value={status.name}
   *     onChange={(e) => setField('name', e.target.value)}
   *   />
   * </Form.Item>
   * ```
   * @param name 메시지와 상태를 가져올 필드명.
   */
  getAntdStatus(name: keyof T): AntdFormItemValidationMessageDto;
}

function getValidStatus(msg?: string): AntdFormItemValidationMessageDto {
  if (!msg) {
    return {};
  }
  return {
    validateStatus: 'error',
    help: msg,
  };
}

function dispatchField<T>(
  setState: Dispatch<SetStateAction<T>>,
  setMessage: Dispatch<SetStateAction<Partial<Record<keyof T, string>>>>,
  prevValue: T,
  arg0: keyof T | Partial<T> | ((prev: T) => Partial<T>),
  arg1: T[keyof T]
) {
  if (typeof arg0 === 'string') {
    const name = arg0;
    const value = arg1;

    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage((prev) => ({
      ...prev,
      [name]: '',
    }));

    return;
  }

  let nextValue: Partial<T>;

  if (typeof arg0 === 'function') {
    nextValue = arg0({ ...prevValue });
  } else if (typeof arg0 === 'object') {
    nextValue = arg0;
  } else {
    return;
  }

  setState((prev) => {
    return {
      ...prev,
      ...nextValue,
    };
  });
  setMessage((prev) => {
    return Object.keys(nextValue).reduce(
      (acc, key) => {
        acc[key as keyof T] = '';

        return acc;
      },
      { ...prev }
    );
  });
}

/**
 * 유효성 검증과 상태 제어 기능을 제공하는 훅스.
 * @param initData 설정할 초기 데이터
 * @param validateFn 유효성 검증에 필요한 함수. 설정하지 않으면 유효성 검증을 무시한다.
 * @param autoFocusOnError 유효성 검증 실패 시 가장 첫번째 입력 요소에 자동으로 포커스를 준다. 기본 false.
 * @returns
 *
 * @example
 * ```tsx
 * import { validate, useValidate } from 'jordy';
 *
 * function validateData(data: MyUiState) {
 *   return validate(data, {
 *     // 유효성 검증 코드
 *   });
 * }
 *
 * function ViewComponent() {
 *   const {
 *     state,
 *     setField,
 *     errorMessage,
 *     validate,
 *     getAntdStatus
 *   } = useValidate(
 *     createMyUiState,
 *     validateData,
 *   );
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *
 *     const result = validate();
 *
 *     if (result.isValid) {
 *       alert('작성 완료!');
 *     } else {
 *       alert(result.firstMessage);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         value={state.textInput}
 *         onChange={({ target }) => setField('textInput', target.value)}
 *       />
 *       <p>{errorMessage.textInput}</p>
 *
 *       -- antd 활용 --
 *       <Form.Item {...getAntdStatus('textInput')}>
 *         <Input
 *           value={state.textInput}
 *           onChange={({ target }) => setField('textInput', target.value)}
 *         />
 *       </Form.Item>
 *
 *       <button>보내기</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useValidate<T extends Record<string, any>>(
  initData: T | (() => T),
  validateFn?: (data: T) => ValidateBulkResultUiState,
  autoFocusOnError = false
): ValidateHookResult<T> {
  const [state, setState] = useState(initData);
  const refInitState = useRef(state);
  const refState = useRef(state);
  const refResult = useRef<ValidateBulkResultUiState | null>(null);
  const [message, setMessage] = useState<Partial<Record<keyof T, string>>>({});

  useEffect(() => {
    refState.current = state;
  }, [state]);

  const setField = useCallback(
    ((
      arg0: keyof T | Partial<T> | ((prev: T) => Partial<T>),
      arg1: T[keyof T]
    ) => {
      dispatchField(setState, setMessage, refState.current, arg0, arg1);
    }) as FieldDispatch<T>,
    []
  );

  const setFieldMessage = useCallback(
    ((arg0: keyof T | Partial<{ [key in keyof T]: string }>, arg1: string) => {
      if (typeof arg0 === 'object') {
        setMessage((prev) => ({
          ...prev,
          ...arg0,
        }));

        return;
      }

      setMessage((prev) => ({
        ...prev,
        [arg0]: arg1,
      }));
    }) as MessageDispatch<T>,
    []
  );

  const clearMessage = useCallback(() => {
    setMessage({});
    refResult.current = null;
  }, []);

  const reset = useCallback(() => {
    setMessage({});
    setState(refInitState.current);
    refResult.current = null;
  }, []);

  const getAntdStatus = useCallback(
    (name: keyof T) => {
      return getValidStatus(message[name]);
    },
    [message]
  );

  const doValidate = useCallback(() => {
    if (!validateFn) {
      return validateSubUtils.createValidateBulkResultUiState();
    }

    const result = validateFn(refState.current);

    if (result.isValid === false) {
      refResult.current = result;
      setMessage(result.errorMessages as Partial<Record<keyof T, string>>);

      if (autoFocusOnError) {
        focusByNames(result.invalidKeys);
      }

      return result;
    }

    refResult.current = null;
    setMessage({});

    return result;
  }, [validateFn, autoFocusOnError]);

  const focusAtFirstError = useCallback(() => {
    const result = refResult.current;

    if (result) {
      focusByNames(result.invalidKeys);
    }
  }, []);

  return {
    state,
    errorMessage: message,
    setField,
    setMessage: setFieldMessage,
    clearMessage,
    reset,
    validate: doValidate,
    focusAtFirstError,
    getAntdStatus,
  };
}
