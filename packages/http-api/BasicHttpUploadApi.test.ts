import { BasicHttpUploadApi } from './BasicHttpUploadApi';
import { AsyncHttpUploadConfig, AsyncHttpUploadProvider } from './network.type';

describe('BasicHttpUploadApi', () => {
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

  const PROGRESS_LIST = [0, 25, 75, 100];

  function uploadProgress({ onProgress }: AsyncHttpUploadConfig) {
    if (onProgress) {
      PROGRESS_LIST.forEach((progress) => {
        onProgress({
          progress,
          loaded: progress,
          total: 100,
          completed: progress >= 100,
        });
      });
    }

    return Promise.resolve(createMockEntity());
  }

  const providerMock = {
    post: vi.fn(uploadProgress),
    put: vi.fn(uploadProgress),
  };
  const baseUrl = 'https://api.myhome.co.kr';
  const headers = {
    token: 'blahblah',
    contentType: 'json',
  } as Record<string, string>;
  const headerCreatorMock = vi.fn().mockResolvedValue(headers);
  const serializerMock = vi.fn(() => 'search=lookpin');
  const httpApi = new BasicHttpUploadApi(
    providerMock as AsyncHttpUploadProvider,
    baseUrl,
    headerCreatorMock,
    serializerMock,
    true
  );

  const callbackMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.each(['post', 'put'] as const)('%s 메서드 기능 테스트', (method) => {
    it('요청 시 내부 제공자를 호출한다.', async () => {
      const subUrl = '/sonic/boom';
      const data = { goods: 'jordy', corp: 'lookpin' };
      const result = await httpApi[`${method}Upload`](
        subUrl,
        data,
        callbackMock,
        100
      );

      expect(result).toEqual(createMockEntity());
      expect(providerMock[method]).toBeCalledWith(
        expect.objectContaining({
          url: `${baseUrl}${subUrl}`,
          headers,
          withCredentials: true,
          data,
          timeout: 100,
        })
      );
    });

    it('업로드 시 콜백으로 진행상황을 알릴 수 있다.', async () => {
      const subUrl = '/sonic/boom';
      const data = { goods: 'jordy', corp: 'lookpin' };

      await httpApi[`${method}Upload`](subUrl, data, callbackMock);

      expect(callbackMock).toBeCalledTimes(PROGRESS_LIST.length);

      PROGRESS_LIST.forEach((progress, index) => {
        expect(callbackMock).toHaveBeenNthCalledWith(index + 1, {
          progress,
          loaded: progress,
          total: 100,
          completed: progress >= 100,
        });
      });
    });

    it('내부 제공자를 호출하여 오류가 발생되면 그 오류 내용을 그대로 전달한다.', async () => {
      providerMock[method].mockRejectedValueOnce(new Error('oops!'));

      const subUrl = '/throw/error';
      const data = { goods: 'jordy', corp: 'lookpin' };

      await expect(
        httpApi[`${method}Upload`](subUrl, data, callbackMock, 100)
      ).rejects.toThrowError('oops!');
    });

    it('요청 시 설정된 headersCreator 를 호출한다.', async () => {
      await httpApi[`${method}Upload`]('/user/search', { q: 'haha' });

      expect(headerCreatorMock).toBeCalledTimes(1);
    });

    it('headersCreator 호출 시 오류가 생겼다면 내부 제공자를 호출하지 않는다.', async () => {
      headerCreatorMock.mockRejectedValueOnce(new Error('unauthorized!'));

      await expect(
        httpApi[`${method}Upload`]('/user/search', { q: 'haha' })
      ).rejects.toThrowError('unauthorized!');

      expect(providerMock[method]).not.toBeCalled();
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
        await httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' });

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

        await httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' });

        expect(serializerMock).toBeCalledTimes(1);
        expect(providerMock[method]).toBeCalledWith(
          expect.objectContaining({
            url: expect.stringContaining('q=lookpin&n=123'),
          })
        );
      });

      it('header 에서 오류 발생 시 params interceptor 를 호출하지 않는다.', async () => {
        headerCreatorMock.mockRejectedValueOnce(new Error('some error!'));

        await expect(
          httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(paramsInterMock).not.toBeCalled();
      });

      it('오류 발생 시 설정된 error interceptor 를 호출한다.', async () => {
        providerMock[method].mockRejectedValueOnce(new Error('some error'));

        await expect(
          httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' })
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
          httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' })
        ).rejects.toThrow();

        expect(errorInterMock).toBeCalledTimes(1);
        expect(errorInterMock).toBeCalledWith(
          expect.objectContaining({
            message: 'need to login!',
          })
        );
      });

      it('오류가 발생되지 않는다면 error interceptor 를 호출하지 않는다.', async () => {
        await httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' });

        expect(errorInterMock).not.toBeCalled();
      });

      it('후속 프로세스에서 오류가 발생된 것에 error interceptor 는 관여하지 않는다.', async () => {
        await expect(
          httpApi[`${method}Upload`]('/user/search', { q: 'lookpin' }).then(
            () => Promise.reject(new Error('what the ??'))
          )
        ).rejects.toThrow();

        expect(errorInterMock).not.toBeCalled();
      });
    }); // interceptor 사용 [end]
  }); // %s 메서드 기능 테스트 [end]
});
