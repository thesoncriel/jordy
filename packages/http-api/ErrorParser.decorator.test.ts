import { ErrorParser } from './ErrorParser.decorator';
import {
  AsyncHttpNetworkConfig,
  AsyncHttpNetworkProvider,
  AsyncHttpUploadProvider,
} from './network.type';

describe('ErrorParser', () => {
  function createMockMethod(method: string) {
    return vi.fn().mockRejectedValue(new Error(`${method}: some error`));
  }
  const mockFnDic: AsyncHttpNetworkProvider & AsyncHttpUploadProvider = {
    get: createMockMethod('get'),
    put: createMockMethod('put'),
    post: createMockMethod('post'),
    patch: createMockMethod('patch'),
    delete: createMockMethod('delete'),
    getBlob: createMockMethod('getBlob'),
  };
  const parserMockFn = vi.fn((error) => error);

  const methodList = [
    'get',
    'put',
    'post',
    'patch',
    'delete',
    'getBlob',
  ] as const;

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('메서드 수행 시 parser 인자를 자동으로 수행한다.', () => {
    @ErrorParser(parserMockFn)
    class HttpApiMock implements AsyncHttpNetworkProvider {
      get = mockFnDic.get;
      put = mockFnDic.put;
      post = mockFnDic.post;
      patch = mockFnDic.patch;
      delete = mockFnDic.delete;
      getBlob = mockFnDic.getBlob;
    }

    it.each(
      methodList.map((key) => {
        return [key, '/some/path', { name: 'theson' }] as const;
      })
    )('%s 메서드', async (method, path: string, params) => {
      const httpApi = new HttpApiMock();

      await expect(
        (httpApi[method] as CallableFunction)(path, params as never)
      ).rejects.toThrow('some');

      expect(parserMockFn).toBeCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('some error'),
        }),
        method === 'getBlob' ? 'get' : method,
        path
      );
      expect(mockFnDic[method]).toBeCalledWith(path, params);
    });
  });

  describe('수행 불가능한 메서드를 임의로 수행 시키면 오류가 발생된다.', async () => {
    @ErrorParser(parserMockFn)
    class HttpApiMock implements AsyncHttpUploadProvider {
      post = mockFnDic.post;
      put = mockFnDic.put;
    }

    const unableMethodList = ['get', 'patch', 'delete', 'getBlob'] as const;

    it.each(
      unableMethodList.map((key) => {
        return [key, '/some/path', { name: 'theson' }] as const;
      })
    )('%s 메서드 -> 불가', async (method, path: string, params) => {
      const httpApi = new HttpApiMock();

      expect(() =>
        (httpApi[method as never] as CallableFunction)(path, params as never)
      ).toThrow('of undefined');

      expect(parserMockFn).not.toBeCalled();
      expect(mockFnDic[method]).not.toBeCalled();
    });

    const ableMethodList = ['post', 'put'] as const;

    it.each(
      ableMethodList.map((key, index) => {
        return [key, `/some/path/${index + 100}`, { name: 'theson' }] as const;
      })
    )('%s 메서드 -> 가능', async (method, path: string, params) => {
      const httpApi = new HttpApiMock();

      await expect(
        (httpApi[method as never] as CallableFunction)(path, params as never)
      ).rejects.toThrow(`${method}: some error`);

      expect(parserMockFn).toBeCalled();
      expect(mockFnDic[method]).toBeCalledWith(path, params);
    });
  });

  describe('단일 메서드 테스트', () => {
    @ErrorParser(parserMockFn)
    class NetworkProviderMock implements AsyncHttpNetworkProvider {
      get = mockFnDic.get;
      put = mockFnDic.put;
      post = mockFnDic.post;
      patch = mockFnDic.patch;
      delete = mockFnDic.delete;
      getBlob = mockFnDic.getBlob;
    }

    it('parser 수행 중 스스로 오류를 일으키면, 그 내용을 오류값으로 이용한다.', async () => {
      const fakeError = {
        message: 'lookpin error',
        someValue: 123,
        myData: {
          age: 20,
          name: 'jordy',
          job: '취준생',
        },
      };

      parserMockFn.mockImplementationOnce(() => {
        throw fakeError;
      });

      const provider = new NetworkProviderMock();
      const url = '/some/path';
      const headers = {
        some_name: 'blahblah',
        some_key: 'lorem ipsum',
      };
      const params = {
        name: 'sonic',
        age: 20,
        location: 'sega',
      };
      const config: AsyncHttpNetworkConfig = {
        url,
        headers,
        params,
        timeout: 100,
      };

      await expect(provider.post(config)).rejects.toThrow(
        expect.objectContaining(fakeError)
      );

      expect(parserMockFn).toBeCalledTimes(1);
      expect(mockFnDic.post).toBeCalledWith(config);
    });

    it('parser 수행 중 스스로 오류를 리턴하면, 그 내용을 오류값으로 이용한다.', async () => {
      const fakeError = {
        message: 'jordy error',
        someValue: 123,
        myData: {
          age: 20,
          name: 'jordy',
          job: '취준생?!',
        },
      };
      parserMockFn.mockImplementationOnce(() => {
        return fakeError;
      });

      const provider = new NetworkProviderMock();
      const url = '/some/path';
      const headers = {
        some_name: 'blahblah',
        some_key: 'lorem ipsum',
      };
      const params = {
        name: 'mocksa',
        age: 39,
        location: 'lookpin',
      };
      const config: AsyncHttpNetworkConfig = {
        url,
        headers,
        params,
        timeout: 10000,
      };

      await expect(provider.post(config)).rejects.toThrow(
        expect.objectContaining(fakeError)
      );

      expect(parserMockFn).toBeCalledTimes(1);
      expect(mockFnDic.post).toBeCalledWith(config);
    });

    it('메서드 수행 시 오류가 발생되지 않는다면 parser 가 수행되지 않는다.', async () => {
      interface MockEntity {
        items: number[];
        page: number;
        size: number;
      }
      const value: MockEntity = {
        items: [1, 2, 3, 4, 5],
        page: 1,
        size: 10,
      };

      vi.mocked(mockFnDic.get).mockResolvedValueOnce(value);

      const provider = new NetworkProviderMock();
      const url = '/some/search';
      const headers = {
        some_name: 'blahblah',
        some_key: 'lorem ipsum',
      };
      const params = {
        keyword: 'sonic',
      };
      const config: AsyncHttpNetworkConfig = {
        url,
        headers,
        params,
      };

      const result = await provider.get<MockEntity>(config);

      expect(result).toEqual(value);

      expect(parserMockFn).not.toBeCalled();
      expect(mockFnDic.get).toBeCalledTimes(1);
      expect(mockFnDic.get).toBeCalledWith(config);
      expect(mockFnDic.post).not.toBeCalledWith(config);
    });
  });
});
