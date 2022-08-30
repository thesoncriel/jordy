import { ErrorParser } from './ErrorParser.decorator';
import {
  AsyncHttpNetworkProvider,
  AsyncHttpUploadProvider,
  HttpApi,
  HttpUploadApi,
} from './network.type';

describe('ErrorParser', () => {
  function createMockMethod(method: string) {
    return vi.fn().mockRejectedValue(new Error(`${method}: some error`));
  }
  const mockFnDic: HttpApi &
    HttpUploadApi &
    AsyncHttpNetworkProvider &
    AsyncHttpUploadProvider = {
    get: createMockMethod('get'),
    put: createMockMethod('put'),
    post: createMockMethod('post'),
    patch: createMockMethod('patch'),
    delete: createMockMethod('delete'),
    getFile: createMockMethod('getFile'),
    getBlob: createMockMethod('getBlob'),
    putUpload: createMockMethod('putUpload'),
    postUpload: createMockMethod('postUpload'),
  };
  const parserMockFn = vi.fn((error) => error);

  const methodList = [
    'get',
    'put',
    'post',
    'patch',
    'delete',
    'getFile',
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
    class HttpApiMock implements HttpApi {
      get = mockFnDic.get;
      put = mockFnDic.put;
      post = mockFnDic.post;
      patch = mockFnDic.patch;
      delete = mockFnDic.delete;
      getFile = mockFnDic.getFile;
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
      ).rejects.toThrowError('some');

      expect(parserMockFn).toBeCalled();
      expect(mockFnDic[method]).toBeCalledWith(path, params);
    });
  });

  describe('수행 불가능한 메서드를 임의로 수행 시키면 오류가 발생된다.', async () => {
    @ErrorParser(parserMockFn)
    class HttpApiMock implements HttpUploadApi {
      postUpload = mockFnDic.postUpload;
      putUpload = mockFnDic.putUpload;
    }

    const unableMethodList = [
      'get',
      'put',
      'post',
      'patch',
      'delete',
      'getFile',
      'getBlob',
    ] as const;

    it.each(
      unableMethodList.map((key) => {
        return [key, '/some/path', { name: 'theson' }] as const;
      })
    )('%s 메서드 -> 불가', async (method, path: string, params) => {
      const httpApi = new HttpApiMock();

      expect(() =>
        (httpApi[method as never] as CallableFunction)(path, params as never)
      ).toThrowError('of undefined');

      expect(parserMockFn).not.toBeCalled();
      expect(mockFnDic[method]).not.toBeCalled();
    });

    const ableMethodList = ['postUpload', 'putUpload'] as const;

    it.each(
      ableMethodList.map((key, index) => {
        return [key, `/some/path/${index + 100}`, { name: 'theson' }] as const;
      })
    )('%s 메서드 -> 가능', async (method, path: string, params) => {
      const httpApi = new HttpApiMock();

      await expect(
        (httpApi[method as never] as CallableFunction)(path, params as never)
      ).rejects.toThrowError(`${method}: some error`);

      expect(parserMockFn).toBeCalled();
      expect(mockFnDic[method]).toBeCalledWith(path, params);
    });
  });

  describe('단일 메서드 테스트', () => {
    @ErrorParser(parserMockFn)
    class NetworkProvider implements AsyncHttpNetworkProvider {
      get = mockFnDic.get;
      put = mockFnDic.put;
      post = mockFnDic.post;
      patch = mockFnDic.patch;
      delete = mockFnDic.delete;
      getBlob = mockFnDic.getBlob;
    }

    it('parser 수행 중 스스로 오류를 일으키면, 그 내용을 오류값으로 이용한다.', async () => {
      parserMockFn.mockImplementationOnce(() => {
        throw new Error('lookpin error');
      });

      const provider = new NetworkProvider();
      const path = '/some/path';
      const data = {
        name: 'sonic',
        age: 20,
        location: 'sega',
      };

      await expect(provider.post(path, data, 100)).rejects.toThrowError(
        'lookpin'
      );

      expect(parserMockFn).toBeCalledTimes(1);
      expect(mockFnDic.post).toBeCalledWith(path, data, 100);
    });

    it('parser 수행 중 스스로 오류를 리턴하면, 그 내용을 오류값으로 이용한다.', async () => {
      parserMockFn.mockImplementationOnce(() => {
        return new Error('theson error');
      });

      const provider = new NetworkProvider();
      const path = '/some/path';
      const data = {
        name: 'mocksa',
        age: 39,
        location: 'lookpin',
      };

      await expect(provider.post(path, data, 10000)).rejects.toThrowError(
        'theson'
      );

      expect(parserMockFn).toBeCalledTimes(1);
      expect(mockFnDic.post).toBeCalledWith(path, data, 10000);
    });

    it('메서드 수행 시 오류가 발생되지 않는다면 parser 가 수행되지 않는다.', async () => {
      interface MockEntity {
        items: number[];
        page: number;
        size: number;
      }
      interface MockParams {
        keyword?: string;
        checked?: boolean;
      }
      const value: MockEntity = {
        items: [1, 2, 3, 4, 5],
        page: 1,
        size: 10,
      };

      vi.mocked(mockFnDic.get).mockResolvedValueOnce(value);

      const provider = new NetworkProvider();
      const path = '/some/search';
      const params: MockParams = {
        keyword: 'sonic',
      };

      const result = await provider.get<MockEntity, MockParams>(path, params);

      expect(result).toEqual(value);

      expect(parserMockFn).not.toBeCalled();
      expect(mockFnDic.get).toBeCalledTimes(1);
      expect(mockFnDic.get).toBeCalledWith(path, params);
      expect(mockFnDic.post).not.toBeCalledWith(path, params);
    });
  });
});
