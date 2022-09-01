import { HttpRestError } from '../HttpRestError';
import { throwableAxiosErrorParser } from './throwableAxiosErrorParser';

vi.mock('./axios.util', () => {
  return {
    isAxiosError: vi.fn(() => true),
  };
});

describe('throwableAxiosErrorParser', async () => {
  const { isAxiosError } = await import('./axios.util');

  beforeEach(() => {
    vi.mocked(isAxiosError).mockClear();
  });
  afterAll(() => {
    vi.mocked(isAxiosError).mockRestore();
  });

  it('수행 시 에러 형태가 AxiosError 내용과 흡사한지 확인한다.', () => {
    vi.mocked(isAxiosError).mockImplementationOnce(() => false);
    throwableAxiosErrorParser(null);

    expect(isAxiosError).toHaveLastReturnedWith(false);
  });

  it('에러 형태가 AxiosError 가 아닐 경우 아무것도 하지 않는다.', () => {
    vi.mocked(isAxiosError).mockImplementationOnce(() => false);
    expect(() =>
      throwableAxiosErrorParser({ message: 'blah' })
    ).not.toThrowError();
  });

  describe('AxiosError 내용일 때', () => {
    it('메타 데이터와 오류 데이터가 포함된다.', () => {
      expect.assertions(2);

      try {
        throwableAxiosErrorParser({
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
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpRestError);
        expect((error as HttpRestError).toPlainObject()).toEqual({
          message: 'lookpin',
          errorType: 'notFound',
          url: '/some/path/10',
          method: 'delete',
          rawData: expect.objectContaining({
            message: 'lookpin',
          }),
        });
      }
    });

    it('응답 데이터가 html 문서라면 기본 메시지가 적용된다.', () => {
      expect.assertions(2);

      try {
        throwableAxiosErrorParser({
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
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpRestError);
        expect((error as HttpRestError).toPlainObject()).toEqual({
          message: HttpRestError.DEFAULT_MESSAGE,
          errorType: 'server',
          url: '/some/path',
          method: 'put',
          rawData: expect.stringContaining('lorem'),
        });
      }
    });

    it('응답 데이터가 일반 문자열이면 그 내용이 메시지에 포함된다.', () => {
      expect.assertions(2);

      try {
        throwableAxiosErrorParser({
          response: {
            data: 'lookpin lover',
            status: 401,
          },
          config: {
            method: 'POST',
            url: '/some/path',
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpRestError);
        expect((error as HttpRestError).toPlainObject()).toEqual({
          message: 'lookpin lover',
          errorType: 'auth',
          url: '/some/path',
          method: 'post',
          rawData: expect.stringContaining('lover'),
        });
      }
    });

    it('응답 데이터가 해석될 수 없다면 응답된 데이터는 rawData 에서 확인 가능하며, 기본 메시지가 적용된다.', () => {
      expect.assertions(2);

      try {
        throwableAxiosErrorParser({
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
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpRestError);
        expect((error as HttpRestError).toPlainObject()).toEqual({
          message: HttpRestError.DEFAULT_MESSAGE,
          errorType: 'notFound',
          url: '/some/path',
          method: undefined,
          rawData: {
            meta: {
              items: [1, 2, 3, 4, 5],
            },
          },
        });
      }
    });
    // AxiosError 내용일 때 - [end]
  });
});
