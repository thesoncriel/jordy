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

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.each(['get', 'post', 'put', 'patch', 'delete'] as const)(
    '%s 메서드 기능 테스트',
    (method) => {
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
    }
  ); // %s 메서드 기능 테스트 [end]

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
  }); // getBlob 메서드 테스트 [end]
});
