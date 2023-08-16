/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestError } from './HttpRestError';
import { HttpRestErrorLike, HttpRestErrorMetaArgs } from './HttpRestError.type';

describe('HttpRestError', () => {
  it('첫번째 인자는 메시지로 적용된다.', () => {
    const result = new HttpRestError('blah');

    expect(result.message).toBe('blah');
  });
  describe('두번째 인자에 지정된 문자열을 넣으면 에러 타입으로 적용된다.', () => {
    it.each([
      'unknown',
      'auth',
      'forbidden',
      'notFound',
      'badRequest',
      'server',
    ] as const)('%s 값', (errorType) => {
      const result = new HttpRestError('lookpin!', errorType);

      expect(result.errorType).toBe(errorType);
    });
  });
  describe('두번째 인자에 숫자를 넣으면 HTTP Status Code 로 인식 시도한다.', () => {
    it.each([
      [
        0,
        'unknown',
        100,
        'unknown',
        200,
        'unknown',
        300,
        'unknown',
        400,
        'badRequest',
        401,
        'auth',
        403,
        'forbidden',
        404,
        'notFound',
        410,
        'badRequest',
        499,
        'badRequest',
        500,
        'server',
        510,
        'server',
        599,
        'server',
        600,
        'unknown',
        700,
        'unknown',
      ],
    ])('%s 값 -> %s', (code, type) => {
      const result = new HttpRestError('lookpin', code);

      expect(result.errorType).toBe(type);
    });
  });
  describe('두번째 인자에 인식할 수 없는 값이 들어가면 unknown 으로 적용된다.', () => {
    it.each([null, '', undefined, NaN, true, false, {}, () => true])(
      '"%s" 값',
      (value) => {
        const result = new HttpRestError('lookpin', value as any);

        expect(result.errorType).toBe('unknown');
      }
    );
  });
  it('두번째 인자가 HttpRestError 와 유사하다면 그 값을 그대로 적용한다.', () => {
    const given: HttpRestErrorLike = {
      message: 'theson',
      url: 'blah blah path',
      errorType: 'badRequest',
      rawData: {
        message: 'oh~ lookpin!!',
      },
    };
    const result = new HttpRestError('theson', given);

    expect(result).toContain({
      ...given,
    });
  });
  describe('두번째 인자가 비어있진 않은데 문자열이 아니라면 메타 정보라 판단하고 적용 시도한다.', () => {
    it.each([
      [
        '의도했던 자료',
        {
          url: 'lookpin/home/page',
          status: 404,
          rawData: {
            status: '뭔지 모르지만 일단 오류',
            message: '흥해라 룩핀!',
          },
        },
        'notFound',
      ],
      [
        '필드는 있으나 의도하지 않던 값',
        {
          url: null,
          status: 123,
          rawData: null,
        },
        'unknown',
      ],
      [
        '필드가 부족함',
        {
          url: '',
          blahBlah: NaN,
        },
        'unknown',
      ],
      [
        '모든 필드가 비었음',
        {}, //
        'unknown',
      ],
    ])('%s', (_, arg: HttpRestErrorMetaArgs, errorType) => {
      const result = new HttpRestError('lookpin', arg);

      expect(result).toContain({
        url: arg.url || '',
        errorType,
        rawData: arg.rawData,
      });
    });
  });

  it('생성된 오류 객체에서 stack 을 호출할 수 있다.', () => {
    const result = new HttpRestError('blah blah');

    expect(result.stack).toBeTruthy();
  });

  it('생성된 오류객체를 spread syntax 로 쓸 경우 함수를 제외한 내부값을 복사한다.', () => {
    const meta: HttpRestErrorLike = {
      message: 'lookpin lover',
      url: 'lookpin.co.kr',
      method: 'get',
      errorType: 'badRequest',
      rawData: {
        name: 'jordy',
        age: 21,
      },
    };
    const given = new HttpRestError(meta.message, meta);
    const { stack: _stack, name: _name, ...result } = { ...given };

    expect(result).toEqual(meta);
  });
});
