import { ErrorLike, HttpRestError, HttpRestErrorLike } from '../HttpRestError';
import { throwableAxiosErrorParser } from './throwableAxiosErrorParser';

vi.mock('./axios.util', () => {
  return {
    isAxiosError: vi.fn(() => true),
  };
});

describe('throwableAxiosErrorParser', async () => {
  const { isAxiosError } = await import('./axios.util');
  const GIVEN_URL = 'https://api.blah.com/list';

  beforeEach(() => {
    vi.mocked(isAxiosError).mockClear();
  });
  afterAll(() => {
    vi.mocked(isAxiosError).mockRestore();
  });

  it('수행 시 에러 형태가 AxiosError 내용과 흡사한지 확인한다.', () => {
    vi.mocked(isAxiosError).mockImplementationOnce(() => false);
    expect(() => throwableAxiosErrorParser(null, 'get', GIVEN_URL)).toThrow();

    expect(isAxiosError).toHaveLastReturnedWith(false);
  });

  describe('AxiosError 내용일 때', () => {
    const AXIOS_ERROR_MOCK = {
      response: {
        data: {
          message: 'lookpin',
        },
        status: 404,
      },
      config: {
        url: '/some/path/10',
        method: 'delete',
      },
    };

    it('만들어진 오류 객체는 HttpRestError 타입의 인스턴스이다.', () => {
      expect(() =>
        throwableAxiosErrorParser(AXIOS_ERROR_MOCK, 'get', GIVEN_URL)
      ).toThrow(HttpRestError);
    });
    it('메타 데이터와 오류 데이터가 포함된다.', () => {
      expect(() =>
        throwableAxiosErrorParser(AXIOS_ERROR_MOCK, 'get', GIVEN_URL)
      ).toThrow(
        expect.objectContaining({
          message: 'lookpin',
          errorType: 'notFound',
          url: '/some/path/10',
          method: 'delete',
          rawData: AXIOS_ERROR_MOCK.response.data,
        })
      );
    });

    it('응답 데이터가 html 문서라면 기본 메시지가 적용된다.', () => {
      const given = {
        response: {
          data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
  <title>lookpin - korean best shopping platform</title>
</head>
<body style="background: gray">
  <p>
  lorem ipsum blah blah..
  </p>
</body>
</html>`,
          status: 500,
        },
        config: {
          url: '/some/path',
          method: 'PUT',
        },
      };

      expect(() => throwableAxiosErrorParser(given, 'get', GIVEN_URL)).toThrow(
        expect.objectContaining({
          message: HttpRestError.DEFAULT_MESSAGE,
          errorType: 'server',
          url: '/some/path',
          method: 'put',
          rawData: expect.stringContaining('lorem'),
        })
      );
    });

    it('응답 데이터가 일반 문자열이면 그 내용이 메시지에 포함된다.', () => {
      const given = {
        response: {
          data: 'lookpin lover',
          status: 401,
        },
        config: {
          method: 'POST',
          url: '/some/path',
        },
      };

      expect(() => throwableAxiosErrorParser(given, 'get', GIVEN_URL)).toThrow(
        expect.objectContaining({
          message: 'lookpin lover',
          errorType: 'auth',
          url: '/some/path',
          method: 'post',
          rawData: expect.stringContaining('lover'),
        })
      );
    });

    it('응답 데이터가 해석될 수 없다면 응답된 데이터는 rawData 에서 확인 가능하며, 기본 메시지가 적용된다.', () => {
      const given = {
        response: {
          data: {
            meta: {
              items: [1, 2, 3, 4, 5],
            },
          },
          status: '404',
        },
        config: {
          url: '/some/path',
        },
      };

      expect(() => throwableAxiosErrorParser(given, 'get', GIVEN_URL)).toThrow(
        expect.objectContaining({
          message: HttpRestError.DEFAULT_MESSAGE,
          errorType: 'notFound',
          url: '/some/path',
          method: 'get',
          rawData: given.response.data,
        })
      );
    });
  }); // AxiosError 내용일 때 - [end]

  describe('AxiosError 가 아닐 때', () => {
    beforeEach(() => {
      vi.mocked(isAxiosError).mockImplementationOnce(() => false);
    });

    it('method 와 url 정보로 오류내용을 만든다.', () => {
      const given = { message: 'blah' };

      expect(() => throwableAxiosErrorParser(given, 'get', GIVEN_URL)).toThrow(
        expect.objectContaining({
          message: 'blah',
          method: 'get',
          url: GIVEN_URL,
          rawData: given,
        })
      );
    });

    it('method 혹은 url 정보가 없다면 아무것도 하지 않는다.', () => {
      const given = { message: 'blah' };

      expect(() => throwableAxiosErrorParser(given, 'get', '')).not.toThrow();
    });

    describe('error 가 HttpRestError 타입일 경우', () => {
      it('에러 객체의 속성을 그대로 따른다.', () => {
        const given: HttpRestErrorLike = {
          message: 'lookpin',
          method: 'put',
          url: GIVEN_URL,
          errorType: 'auth',
          rawData: {
            fake: true,
            jordy: true,
            happyPoint: 100,
          },
        };

        expect(() =>
          throwableAxiosErrorParser(given, 'get', GIVEN_URL)
        ).toThrow(expect.objectContaining(given));
      });

      it('에러 객체의 errorType 이 unknown 일 경우 새로 만들어진 오류의 errorType 도 unknown 이다.', () => {
        const given: HttpRestErrorLike = {
          message: 'lookpin',
          method: 'put',
          url: GIVEN_URL,
          errorType: 'unknown',
          rawData: {
            fake: true,
            jordy: true,
            happyPoint: 100,
          },
        };

        expect(() =>
          throwableAxiosErrorParser(given, 'get', GIVEN_URL)
        ).toThrow(
          expect.objectContaining({
            ...given,
            errorType: 'unknown',
          })
        );
      });

      it('에러 객체 내 method 나 url 이 비었다면 전달된 인자를 이용하여 채운다.', () => {
        const given: HttpRestErrorLike = {
          message: 'lookpin?!',
          url: '',
          errorType: 'auth',
          rawData: {
            fake: true,
            jordy: true,
            happyPoint: 100,
          },
        };
        const fakeUrl = 'some/path/haha';

        expect(() => throwableAxiosErrorParser(given, 'get', fakeUrl)).toThrow(
          expect.objectContaining({
            message: given.message,
            method: 'get',
            url: fakeUrl,
            errorType: given.errorType,
            rawData: given.rawData,
          })
        );
      });
    });

    it('error 가 ErrorLike 타입일 경우 그 메시지를 그대로 이용한다.', () => {
      const given: ErrorLike = {
        message: 'lookpin?!',
      };
      const fakeUrl = 'some/path/haha';

      expect(() => throwableAxiosErrorParser(given, 'delete', fakeUrl)).toThrow(
        expect.objectContaining({
          message: given.message,
          method: 'delete',
          url: fakeUrl,
          errorType: 'unknown',
          rawData: given,
        })
      );
    });
  }); // AxiosError 가 아닐 때 - [end]
});
