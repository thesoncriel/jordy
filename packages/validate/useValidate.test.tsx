import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { ChangeEvent } from 'react';
import { useValidate } from './useValidate';
import { ValidateBulkResultModel } from './validate.type';

interface TestState {
  name: string;
  age: number;
  hasCookie: boolean;
}

interface TestProps {
  validateFn: (data: TestState) => ValidateBulkResultModel;
}

function getInitState(): TestState {
  return {
    name: '죠르디',
    age: 10,
    hasCookie: false,
  };
}

const SAMPLE_MESSAGE_DIC = {
  name: '이름은 필수입니다.',
  age: '나이는 필수입니다!',
  hasCookie: '쿠키는 가져가셔야 합니다!',
};

function TestComponent({ validateFn }: TestProps) {
  const fm = useValidate(getInitState, validateFn, true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    if (name === 'name') {
      fm.setField(name, value);
    } else if (name === 'age') {
      fm.setField(name, Number(value));
    } else if (name === 'hasCookie') {
      fm.setField(name, checked);
    }
  };

  return (
    <div>
      <textarea
        data-testid="antd"
        defaultValue={JSON.stringify(fm.getAntdStatus('name'))}
      ></textarea>
      <textarea
        data-testid="state"
        defaultValue={JSON.stringify(fm.state)}
      ></textarea>
      <textarea
        data-testid="message"
        defaultValue={JSON.stringify(fm.errorMessage)}
      ></textarea>
      <input
        data-testid="input.name"
        type="text"
        name="name"
        value={fm.state.name}
        onChange={handleChange}
      />
      <input
        data-testid="input.age"
        type="number"
        name="age"
        value={fm.state.age}
        onChange={handleChange}
      />
      <input
        data-testid="input.hasCookie"
        type="checkbox"
        name="hasCookie"
        value="cookie"
        checked={fm.state.hasCookie}
        onChange={handleChange}
      />
      <button
        data-testid="btnApplyMessage"
        onClick={() => fm.setMessage(SAMPLE_MESSAGE_DIC)}
      >
        메시지 적용
      </button>
      <button data-testid="btnClearMessage" onClick={() => fm.clearMessage()}>
        메시지 초기화
      </button>
      <button data-testid="btnValidate" onClick={() => fm.validate()}>
        유효성 검증
      </button>
      <button data-testid="btnReset" onClick={() => fm.reset()}></button>
    </div>
  );
}

describe('useValidate', () => {
  function getInputElements() {
    return {
      name: screen.getByTestId('input.name'),
      age: screen.getByTestId('input.age'),
      hasCookie: screen.getByTestId('input.hasCookie'),
    };
  }

  function getButtonElements() {
    return {
      applyMessage: screen.getByTestId('btnApplyMessage'),
      clearMessage: screen.getByTestId('btnClearMessage'),
      reset: screen.getByTestId('btnReset'),
      validate: screen.getByTestId('btnValidate'),
    };
  }

  function getMessages() {
    return JSON.parse(screen.getByTestId('message').innerHTML);
  }

  function doInput(
    name: keyof ReturnType<typeof getInputElements>,
    value?: string | boolean
  ) {
    if (typeof value === 'string') {
      fireEvent.input(getInputElements()[name], {
        target: {
          value,
        },
      });

      return;
    }

    fireEvent.click(getInputElements()[name]);
  }

  function doButtonAction(name: keyof ReturnType<typeof getButtonElements>) {
    fireEvent.click(getButtonElements()[name]);
  }

  function getState() {
    return JSON.parse(screen.getByTestId('state').innerHTML);
  }

  const validateFnMock = vi.fn((_: TestState) => {
    const result: ValidateBulkResultModel = {
      isValid: true,
      validKeys: [],
      invalidKeys: [],
      firstMessage: '',
      errorMessages: {},
    };

    return result;
  });

  beforeEach(() => {
    validateFnMock.mockClear();

    render(<TestComponent validateFn={validateFnMock} />);
  });

  it('첫 렌더링 시 메시지 내용은 비어있다.', () => {
    expect(getMessages()).toEqual({});
  });

  it('각 필드별로 메시지를 적용할 수 있다.', () => {
    doButtonAction('applyMessage');

    expect(getMessages()).toEqual({
      name: expect.stringContaining('필수입니다'),
      age: expect.stringContaining('필수입니다'),
      hasCookie: expect.stringContaining('쿠키는'),
    });
  });

  describe('setField', () => {
    beforeEach(() => {
      doInput('name', '');
      doInput('age', '');
    });

    it.each([
      ['문자열', 'name', '', '코디는 룩핀', '코디는 룩핀'],
      ['숫자형', 'age', 0, '12', 12],
      ['체크박스', 'hasCookie', false, true, true],
    ] as const)(
      '입력값이 바뀌면 state 값도 바뀐다. - %s',
      (_, name, prevState, inputValue, nextState) => {
        expect(getState()[name]).toBe(prevState);

        doInput(name, inputValue);

        expect(getState()[name]).toBe(nextState);
      }
    );
  });

  describe('적용된 메시지는 각 필드에 값이 설정되면 빈 값으로 바뀐다.', () => {
    beforeEach(() => {
      doButtonAction('applyMessage');
    });

    it.each([
      ['문자열', 'name', '룩핀'],
      ['숫자형', 'age', '100'],
      ['체크박스', 'hasCookie', true],
    ] as const)('%s 입력 - %s 항목만 초기화된다.', (_, name, value) => {
      doInput(name, value);

      const message = getMessages();

      (['name', 'age', 'hasCookie'] as const).forEach((key) => {
        if (name === key) {
          expect(message[key]).toBe('');
        } else {
          expect(message[key]).not.toBe('');
        }
      });
    });
  });

  it('clearMessage 수행 시 적용된 메시지를 모두 제거한다.', () => {
    doButtonAction('applyMessage');

    expect(getMessages()).not.toEqual({});

    doButtonAction('clearMessage');

    expect(getMessages()).toEqual({});
  });

  it('reset 수행 시 적용된 메시지와 상태값을 모두 초기화 한다.', () => {
    doInput('name', '룩핀');
    doInput('age', '4455');
    doInput('hasCookie', true);
    doButtonAction('applyMessage');

    expect(getMessages()).not.toEqual({});

    expect(getState()).toEqual({
      name: '룩핀',
      age: 4455,
      hasCookie: true,
    });

    doButtonAction('reset');

    expect(getMessages()).toEqual({});
    expect(getState()).toEqual(getInitState());
  });

  describe('validate - 유효성 검증 수행', () => {
    it('유효성 검증 시 적용된 검증 함수를 수행한다.', () => {
      expect(validateFnMock).not.toBeCalled();

      doButtonAction('validate');

      expect(validateFnMock).toBeCalled();
    });

    it('유효성 검증 성공 시 기존 메시지는 초기화된다.', () => {
      expect(getMessages()).toEqual({});

      doButtonAction('applyMessage');

      expect(getMessages()).toEqual(SAMPLE_MESSAGE_DIC);

      doButtonAction('validate');

      expect(getMessages()).toEqual({});
    });

    it('유효성 검증 실패 후 발생된 메시지를 반영시킨다.', () => {
      const messageDic = {
        name: '하나면 하나지 둘이겠느냐',
        age: '둘이면 둘이지',
        hasCookie: '셋이겠느냐',
      };

      validateFnMock.mockImplementationOnce(() => {
        const result: ValidateBulkResultModel = {
          isValid: false,
          validKeys: [],
          invalidKeys: [],
          firstMessage: messageDic.name,
          errorMessages: messageDic,
        };
        return result;
      });

      expect(getMessages()).toEqual({});

      doButtonAction('applyMessage');

      expect(getMessages()).toEqual(SAMPLE_MESSAGE_DIC);

      doButtonAction('validate');

      expect(getMessages()).toEqual(messageDic);
    });

    it('유효성 검증에 일부만 실패 시, 실패한 필드 메시지만 반영된다.', () => {
      const errorMessage = '포메는 사랑입니다 ^^';

      validateFnMock.mockImplementationOnce(() => {
        const result: ValidateBulkResultModel = {
          isValid: false,
          validKeys: ['age', 'hasCookie'],
          invalidKeys: ['name'],
          firstMessage: errorMessage,
          errorMessages: {
            name: errorMessage,
          },
        };
        return result;
      });

      expect(getMessages()).toEqual({});

      doButtonAction('validate');

      expect(getMessages()).toEqual({
        name: errorMessage,
      });
    });

    it('유효성 검증 실패시 그들 중 가장 첫번째 요소에 포커스가 위치한다. (autoFocusOnError = true)', () => {
      const errorMessage = '포메는 사랑입니다 ^^';

      validateFnMock.mockImplementationOnce(() => {
        const result: ValidateBulkResultModel = {
          isValid: false,
          validKeys: ['age', 'hasCookie'],
          invalidKeys: ['name'],
          firstMessage: errorMessage,
          errorMessages: {
            name: errorMessage,
          },
        };
        return result;
      });

      expect(getInputElements().name).not.toHaveFocus();

      doButtonAction('validate');

      expect(getInputElements().name).toHaveFocus();
    });
  });

  describe('getAntdStatus - antd Form.Item 호환 상태값', () => {
    function getAntdStatus() {
      return JSON.parse(screen.getByTestId('antd').innerHTML);
    }

    it('필드 메시지가 없다면 빈 객체를 반환한다.', () => {
      expect(getAntdStatus()).toEqual({});
    });

    it('필드 메시지가 있다면, 메시지와 error 가 포함된 객체를 반환한다.', () => {
      doButtonAction('applyMessage');

      expect(getAntdStatus()).toEqual({
        help: expect.stringContaining('필수'),
        validateStatus: 'error',
      });
    });

    it('필드에 메시지가 있다가 없어지면 다시 빈 객체를 반환한다.', () => {
      doButtonAction('applyMessage');

      expect(getAntdStatus()).not.toEqual({});

      doButtonAction('clearMessage');

      expect(getAntdStatus()).toEqual({});
    });
  });
});
