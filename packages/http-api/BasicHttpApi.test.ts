import { BasicHttpApi } from './BasicHttpApi';

describe('BasicHttpApi', () => {
  interface MockEntity {
    name: string;
    age: number;
  }

  function createMockEntity() {
    return {
      name: 'lookpin',
      age: 10,
    } as MockEntity;
  }

  const pseudoBlob: Blob = {
    size: 0,
    type: '',
    arrayBuffer: vi.fn().mockResolvedValue([]),
    slice: vi.fn(),
    stream: vi.fn(() => ({} as never)),
    text: vi.fn().mockResolvedValue(''),
  };

  const providerMock = {
    get: vi.fn().mockResolvedValue(createMockEntity()),
    post: vi.fn().mockResolvedValue(createMockEntity()),
    put: vi.fn().mockResolvedValue(createMockEntity()),
    patch: vi.fn().mockResolvedValue(createMockEntity()),
    delete: vi.fn().mockResolvedValue(createMockEntity()),
    getBlob: vi.fn().mockResolvedValue(pseudoBlob),
  };

  const baseUrl = 'https://api.myhome.co.kr';
  const headers = {
    token: 'blahblah',
    contentType: 'json',
  } as Record<string, string>;
  const headerCreatorMock = vi.fn().mockResolvedValue(headers);
  const serializerMock = vi.fn(() => 'search=lookpin');

  const httpApi = new BasicHttpApi(
    providerMock,
    baseUrl,
    headerCreatorMock,
    serializerMock,
    true
  );

  const methodList = ['get', 'post', 'put', 'patch', 'delete'] as const;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.each(methodList)('%s 메서드 기능 테스트', (method) => {
    it('요청 시 내부 제공자를 호출한다.', async () => {
      const subUrl = '/sonic/boom';
      const params = { goods: 'jordy', corp: 'lookpin' };
      const result = await httpApi[method](subUrl, params, 100);

      expect(result).toEqual(createMockEntity());
      expect(providerMock[method]).toBeCalledWith(
        expect.objectContaining({
          url: `${baseUrl}${subUrl}`,
          headers,
          withCredentials: true,
          params,
          timeout: 100,
        })
      );
    });

    it('내부 제공자를 호출하여 오류가 발생되면 그 오류 내용을 그대로 전달한다.', async () => {
      providerMock[method].mockRejectedValueOnce(new Error('oops!'));

      const subUrl = '/throw/error';
      const params = { goods: 'jordy', corp: 'lookpin' };

      await expect(httpApi[method](subUrl, params, 100)).rejects.toThrowError(
        'oops!'
      );
    });

    it('요청 시 설정된 headersCreator 를 호출한다.', async () => {
      await httpApi[method]('/user/search', { q: 'haha' });

      expect(headerCreatorMock).toBeCalledTimes(1);
    });

    it('headersCreator 호출 시 오류가 생겼다면 내부 제공자를 호출하지 않는다.', async () => {
      headerCreatorMock.mockRejectedValueOnce(new Error('unauthorized!'));

      await expect(
        httpApi[method]('/user/search', { q: 'haha' })
      ).rejects.toThrowError('unauthorized!');

      expect(providerMock[method]).not.toBeCalled();
    });

    it('headersCreator 호출 시 발생된 오류는 요청된 method 와 url 정보가 포함된다.', async () => {
      const message = 'unauthorized!';
      headerCreatorMock.mockRejectedValueOnce(new Error(message));

      await expect(
        httpApi[method]('/user/search', { q: 'haha' })
      ).rejects.toThrow(
        expect.objectContaining({
          errorType: 'unknown',
          message,
          method,
          url: '/user/search',
          rawData: expect.objectContaining({
            message,
          }),
        })
      );
    });

    it('headersCreator 호출 시 발생된 오류가 HttpRestError 타입과 유사하다면 그 내용을 가진다.', async () => {
      const message = '죠르디다!';
      const url = '/user/search';
      const given = {
        errorType: 'auth',
        message,
        method,
        url,
        rawData: {
          name: 'sonic',
          age: 20,
        },
      };

      headerCreatorMock.mockRejectedValueOnce(given);

      await expect(httpApi[method](url, { q: 'haha' })).rejects.toThrow(
        expect.objectContaining(given)
      );
    });

    describe('interceptor 사용', () => {
      const paramsInterMock = vi.fn();
      const errorInterMock = vi.fn();

      beforeAll(() => {
        httpApi.interceptor = {
          params: paramsInterMock,
          error: errorInterMock,
        };
      });

      afterEach(() => {
        paramsInterMock.mockClear();
        errorInterMock.mockClear();
      });

      afterAll(() => {
        httpApi.interceptor = {};
      });

      it('요청 시 설정된 params interceptor 를 호출한다.', async () => {
        await httpApi[method]('/user/search', { q: 'lookpin' });

        expect(paramsInterMock).toBeCalledTimes(1);
        expect(paramsInterMock).toBeCalledWith(method, '/user/search', {
          q: 'lookpin',
        });
      });

      it('params interceptor 에 리턴된 객체값이 있다면 요청 파라미터에 해당 값을 포함한다.', async () => {
        paramsInterMock.mockImplementationOnce(() => ({
          n: 123,
        }));
        serializerMock.mockImplementationOnce(() => 'q=lookpin&n=123');

        await httpApi[method]('/user/search', { q: 'lookpin' });

        if (method === 'get') {
          expect(providerMock[method]).toBeCalledWith(
            expect.objectContaining({
              params: {
                q: 'lookpin',
                n: 123,
              },
            })
          );
        } else {
          expect(serializerMock).toBeCalledTimes(1);
          expect(providerMock[method]).toBeCalledWith(
            expect.objectContaining({
              url: expect.stringContaining('q=lookpin&n=123'),
            })
          );
        }
      });

      it('header 에서 오류 발생 시 params interceptor 를 호출하지 않는다.', async () => {
        headerCreatorMock.mockRejectedValueOnce(new Error('some error!'));

        await expect(
          httpApi[method]('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(paramsInterMock).not.toBeCalled();
      });

      it('오류 발생 시 설정된 error interceptor 를 호출한다.', async () => {
        providerMock[method].mockRejectedValueOnce(new Error('some error'));

        await expect(
          httpApi[method]('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(errorInterMock).toBeCalledTimes(1);
        expect(errorInterMock).toBeCalledWith(
          expect.objectContaining({
            message: 'some error',
          })
        );
      });

      it('header 에서 오류 발생 시 error interceptor 를 호출한다.', async () => {
        headerCreatorMock.mockRejectedValueOnce(new Error('need to login!'));

        await expect(
          httpApi[method]('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(errorInterMock).toBeCalledTimes(1);
        expect(errorInterMock).toBeCalledWith(
          expect.objectContaining({
            message: 'need to login!',
          })
        );
      });

      it('오류가 발생되지 않는다면 error interceptor 를 호출하지 않는다.', async () => {
        await httpApi[method]('/user/search', { q: 'lookpin' });

        expect(errorInterMock).not.toBeCalled();
      });

      it('후속 프로세스에서 오류가 발생된 것에 error interceptor 는 관여하지 않는다.', async () => {
        await expect(
          httpApi[method]('/user/search', { q: 'lookpin' }).then(() =>
            Promise.reject(new Error('what the ??'))
          )
        ).rejects.toThrow();

        expect(errorInterMock).not.toBeCalled();
      });
    }); // interceptor 사용 [end]
  }); // %s 메서드 기능 테스트 [end]

  describe('getBlob 메서드 테스트', () => {
    it('요청 시 내부 제공자에 맞추어 재요청한다.', async () => {
      const subUrl = '/sonic/boom';
      const params = { goods: 'jordy', corp: 'lookpin' };
      const result = await httpApi.getBlob(subUrl, params);

      expect(result).toEqual(pseudoBlob);
      expect(providerMock.getBlob).toBeCalledWith(
        expect.objectContaining({
          url: `${baseUrl}${subUrl}`,
          headers,
          withCredentials: true,
          params,
        })
      );
    });

    it('내부 제공자를 호출하여 오류가 발생되면 그 오류 내용을 그대로 전달한다.', async () => {
      providerMock.getBlob.mockRejectedValueOnce(new Error('oops!'));

      const subUrl = '/throw/error';
      const params = { goods: 'jordy', corp: 'lookpin' };

      await expect(httpApi.getBlob(subUrl, params)).rejects.toThrowError(
        'oops!'
      );
    });

    it('요청 시 설정된 headersCreator 를 호출한다.', async () => {
      await httpApi.getBlob('/user/search', { q: 'haha' });

      expect(headerCreatorMock).toBeCalledTimes(1);
    });

    it('headersCreator 호출 시 오류가 생겼다면 내부 제공자를 호출하지 않는다.', async () => {
      headerCreatorMock.mockRejectedValueOnce(new Error('unauthorized!'));

      await expect(
        httpApi.getBlob('/user/search', { q: 'haha' })
      ).rejects.toThrowError('unauthorized!');

      expect(providerMock.getBlob).not.toBeCalled();
    });

    describe('interceptor 사용', () => {
      const paramsInterMock = vi.fn();
      const errorInterMock = vi.fn();

      beforeAll(() => {
        httpApi.interceptor = {
          params: paramsInterMock,
          error: errorInterMock,
        };
      });

      afterEach(() => {
        paramsInterMock.mockClear();
        errorInterMock.mockClear();
      });

      afterAll(() => {
        httpApi.interceptor = {};
      });

      it('요청 시 설정된 params interceptor 를 호출한다.', async () => {
        await httpApi.getBlob('/user/search', { q: 'lookpin' });

        expect(paramsInterMock).toBeCalledTimes(1);
        expect(paramsInterMock).toBeCalledWith('get', '/user/search', {
          q: 'lookpin',
        });
      });

      it('params interceptor 에 리턴된 객체값이 있다면 요청 파라미터에 해당 값을 포함한다.', async () => {
        paramsInterMock.mockImplementationOnce(() => ({
          n: 123,
        }));
        serializerMock.mockImplementationOnce(() => 'q=lookpin&n=123');

        await httpApi.getBlob('/user/search', { q: 'lookpin' });

        expect(providerMock.getBlob).toBeCalledWith(
          expect.objectContaining({
            params: {
              q: 'lookpin',
              n: 123,
            },
          })
        );
      });

      it('header 에서 오류 발생 시 params interceptor 를 호출하지 않는다.', async () => {
        headerCreatorMock.mockRejectedValueOnce(new Error('some error!'));

        await expect(
          httpApi.getBlob('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(paramsInterMock).not.toBeCalled();
      });

      it('오류 발생 시 설정된 error interceptor 를 호출한다.', async () => {
        providerMock.getBlob.mockRejectedValueOnce(new Error('some error'));

        await expect(
          httpApi.getBlob('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(errorInterMock).toBeCalledTimes(1);
        expect(errorInterMock).toBeCalledWith(
          expect.objectContaining({
            message: 'some error',
          })
        );
      });

      it('header 에서 오류 발생 시 error interceptor 를 호출한다.', async () => {
        headerCreatorMock.mockRejectedValueOnce(new Error('need to login!'));

        await expect(
          httpApi.getBlob('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(errorInterMock).toBeCalledTimes(1);
        expect(errorInterMock).toBeCalledWith(
          expect.objectContaining({
            message: 'need to login!',
          })
        );
      });

      it('오류가 발생되지 않는다면 error interceptor 를 호출하지 않는다.', async () => {
        await httpApi.getBlob('/user/search', { q: 'lookpin' });

        expect(errorInterMock).not.toBeCalled();
      });

      it('후속 프로세스에서 오류가 발생된 것에 error interceptor 는 관여하지 않는다.', async () => {
        await expect(
          httpApi
            .getBlob('/user/search', { q: 'lookpin' })
            .then(() => Promise.reject(new Error('what the ??')))
        ).rejects.toThrow();

        expect(errorInterMock).not.toBeCalled();
      });
    }); // interceptor 사용 [end]
  }); // getBlob 메서드 테스트 [end]
});
