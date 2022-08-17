import { HttpRestError, HttpRestErrorLike } from '../types';
import {
  isBaseAsyncHttpNetworkConfig,
  throwHttpRestError,
} from './network.util';

describe('isBaseAsyncHttpNetworkConfig', () => {
  it('nullish 에 대응되는 값이면 false 다.', () => {
    const result1 = isBaseAsyncHttpNetworkConfig(null);
    const result2 = isBaseAsyncHttpNetworkConfig(undefined);
    const result3 = isBaseAsyncHttpNetworkConfig(NaN);

    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });

  it('객체값이 아니면 false 다.', () => {
    const result1 = isBaseAsyncHttpNetworkConfig('');
    const result2 = isBaseAsyncHttpNetworkConfig(12);
    const result3 = isBaseAsyncHttpNetworkConfig(true);

    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });

  it('url 필드가 비어있다면 false 다.', () => {
    const result = isBaseAsyncHttpNetworkConfig({
      url: '',
      headers: {},
    });

    expect(result).toBeFalsy();
  });

  it('headers 필드가 비어있다면 false 다.', () => {
    const result = isBaseAsyncHttpNetworkConfig({
      url: 'https://api.theson.kr/haha/hoho/search?q=sonic',
      headers: null,
      withCredentials: true,
      timeout: 0,
    });

    expect(result).toBeFalsy();
  });

  it('url 과 headers 필드가 채워져 있다면 true 다.', () => {
    const result = isBaseAsyncHttpNetworkConfig({
      url: 'https://api.theson.kr/haha/hoho/search?q=sonic',
      headers: {
        token: 'blahblah',
      },
    });

    expect(result).toBeTruthy();
  });

  it('withCredentials 와 timeout 은 있어도 되고 없어도 된다.', () => {
    const config = {
      url: 'https://api.theson.kr/haha/hoho/search?q=sonic',
      headers: {
        token: 'blahblah',
      },
    };

    const result1 = isBaseAsyncHttpNetworkConfig({
      ...config,
      withCredentials: true,
    });
    const result2 = isBaseAsyncHttpNetworkConfig({ ...config, timeout: 10000 });
    const result3 = isBaseAsyncHttpNetworkConfig({
      ...config,
      withCredentials: false,
      timeout: 5000,
    });

    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result3).toBeTruthy();
  });

  it('withCredentials 와 timeout 은 지정된 타입이어야 한다.', () => {
    const config = {
      url: 'https://api.theson.kr/haha/hoho/search?q=sonic',
      headers: {
        token: 'blahblah',
      },
    };

    const result1 = isBaseAsyncHttpNetworkConfig({
      ...config,
      withCredentials: 'throw!!',
    });
    const result2 = isBaseAsyncHttpNetworkConfig({ ...config, timeout: false });
    const result3 = isBaseAsyncHttpNetworkConfig({
      ...config,
      withCredentials: {},
      timeout: () => 1234,
    });

    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });
});

const undeclaredValues = [null, undefined, '', 1, 0, NaN, {}];

describe('throwHttpRestError', () => {
  function throwTest(error: unknown) {
    return () => throwHttpRestError(error);
  }

  const sample: HttpRestErrorLike = {
    message: '잘못된 요청입니다.',
    url: 'https://api.theson.kr/haha/search',
    errorType: 'badRequest',
    rawData: {
      value: 1234,
      name: 'theson',
      corp: 'lookpin',
    },
  };

  const restError = HttpRestError.from('lookpin error');

  describe('의미 없는 값은 모두 기본 메시지가 적용된다.', () => {
    it.each(undeclaredValues)('%s 경우', (arg0) => {
      expect(throwTest(arg0)).toThrowError(HttpRestError.DEFAULT_MESSAGE);
    });
  });

  it.each([
    [
      '문자열이면 그 내용이 메시지가 된다.', //
      'lookpin lover',
      'lookpin lover',
    ],
    [
      '에러 계통이면 에러 메시지를 그대로 이용한다.',
      new Error('lorem ipsum'),
      'lorem ipsum',
    ],
    [
      'HttpRestError 와 닮은 꼴이면 그 내용을 그대로 이용한다.',
      sample,
      sample.message,
    ],
    [
      'HttpRestError 인스턴스라면 그 내용을 그대로 이용한다.',
      restError,
      restError.message,
    ],
  ])('%s', (_desc, error, message) => {
    expect(throwTest(error)).toThrowError(message);
  });
});
