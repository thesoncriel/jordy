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
  const httpApi = new BasicHttpUploadApi(
    providerMock as AsyncHttpUploadProvider,
    baseUrl,
    headerCreatorMock,
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
  });
});
