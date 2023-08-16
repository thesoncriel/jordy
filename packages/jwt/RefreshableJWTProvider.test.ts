import { TokenProvider } from '../storage/storage.type';
import { PromiseResolver } from '../types/etc.type';
import { noop } from '../util/etc';
import { JWTAuthTokenDto } from './jwt.type';
import { RefreshableJWTProvider } from './RefreshableJWTProvider';

describe('RefreshableJWTProvider', () => {
  const TOKEN = {
    ASYNC_QUEUE: 'some_token_by_asyncQueue',
    PROVIDER: {
      ACCESS: 'access_token_by_tokenProvider',
      REFRESH: 'refresh_token_by_tokenProvider',
    },
    REFRESHER: {
      ACCESS: 'access_token_by_refresher',
      REFRESH: 'refresh_token_by_refresher',
    },
  };
  const AUTH_TOKEN_DTO = {
    accessToken: TOKEN.REFRESHER.ACCESS,
    accessTokenExpiredDate: '2022-06-01T12:00:00.000+09:00',
    refreshToken: TOKEN.REFRESHER.REFRESH,
    refreshTokenExpiredDate: '2022-06-01T12:00:00.000+09:00',
  } as JWTAuthTokenDto;

  const asyncQueueMock = {
    awaiting: vi.fn().mockResolvedValue(TOKEN.ASYNC_QUEUE),
    enqueue: vi.fn(),
    dequeue: vi.fn(() => ({
      resolve: vi.fn(),
      reject: vi.fn(),
    })),
    has: vi.fn(() => true),
    size: vi.fn(() => 1),
    resolveAll: vi.fn(() => 1),
    rejectAll: vi.fn(() => 1),
    clear: vi.fn(),
  };
  const accessTokenMock = {
    get: vi.fn(() => TOKEN.PROVIDER.ACCESS),
    set: vi.fn(noop),
    clear: vi.fn(),
  };
  const refreshTokenMock = {
    get: vi.fn(() => TOKEN.PROVIDER.REFRESH),
    set: vi.fn(noop),
    clear: vi.fn(),
  };
  const refresherMock = vi.fn().mockResolvedValue(AUTH_TOKEN_DTO);

  const provider = new RefreshableJWTProvider(
    accessTokenMock as TokenProvider,
    refreshTokenMock as TokenProvider,
    asyncQueueMock,
    refresherMock
  );

  afterEach(() => {
    vi.clearAllMocks();
    provider.clear();
  });

  describe('자체 refresh 수행', () => {
    it('처음 토큰을 가져올 때 자체적으로 refresh 를 수행한다.', async () => {
      const result = await provider.get();

      expect(refresherMock).toBeCalledTimes(1);
      expect(result).toBe(TOKEN.REFRESHER.ACCESS);
    });

    it('refresh 수행전후 상황에 따라 refreshed 상태가 바뀐다.', async () => {
      expect(provider.refreshed).toBe(false);

      await provider.get();

      expect(provider.refreshed).toBe(true);
    });

    it('한번 토큰을 가져오면 다시 refresh 를 수행하지 않는다.', async () => {
      expect(refresherMock).not.toBeCalled();

      await provider.get();

      expect(refresherMock).toBeCalled();

      refresherMock.mockClear();

      await provider.get();
      await provider.get();
      await provider.get();

      expect(refresherMock).not.toBeCalled();
    });

    it('refresh 성공 시 내부 토큰 제공자에 받은 값들을 설정한다.', async () => {
      await provider.get();

      expect(accessTokenMock.set).toBeCalledWith(
        AUTH_TOKEN_DTO.accessToken,
        AUTH_TOKEN_DTO.accessTokenExpiredDate
      );
      expect(refreshTokenMock.set).toBeCalledWith(
        AUTH_TOKEN_DTO.refreshToken,
        AUTH_TOKEN_DTO.refreshTokenExpiredDate
      );
    });

    it('내부 토큰 제공자가 전달하는 값에 유효기간이 비어있다면 undefined 로 전달한다.', async () => {
      refresherMock.mockResolvedValueOnce({
        accessToken: 'jordy',
        refreshToken: 'lookpin',
      } as JWTAuthTokenDto);

      await provider.get();

      expect(accessTokenMock.set).toBeCalledWith('jordy', undefined);
      expect(refreshTokenMock.set).toBeCalledWith('lookpin', undefined);
    });

    it('refresh 성공 시 Async Queue 에 등록된 요청을 모두 resolve 시킨다.', async () => {
      await provider.get();

      expect(asyncQueueMock.resolveAll).toBeCalledWith(
        AUTH_TOKEN_DTO.accessToken
      );
    });

    it('refresh 수행에 실패하면 Async Queue 에 등록된 요청을 모두 reject 시킨다.', async () => {
      refresherMock.mockRejectedValueOnce(new Error('error!'));

      await expect(provider.get()).rejects.toThrowError('error!');

      expect(asyncQueueMock.rejectAll).toBeCalledWith(
        expect.objectContaining({
          message: 'error!',
        })
      );

      expect(refresherMock).toBeCalled();
    });

    it('refresh 실패 시 refreshed 는 false 로 바뀐다.', async () => {
      await provider.get();

      expect(provider.refreshed).toBe(true);

      accessTokenMock.get.mockReturnValueOnce('');
      refresherMock.mockRejectedValueOnce(new Error('what the lookpin ?!'));

      await expect(provider.get()).rejects.toThrow();

      expect(accessTokenMock.get).toBeCalled();
      expect(refresherMock).toBeCalled();
      expect(provider.refreshed).toBe(false);
    });

    it('refresh 성공 후 토큰값 요청을 여러번 하면, 내부 토큰 제공자에 위임하여 이것이 가진 값을 내보낸다.', async () => {
      expect(accessTokenMock.get).not.toBeCalled();

      await provider.get();

      expect(accessTokenMock.get).not.toBeCalled();

      await provider.get();

      expect(accessTokenMock.get).toBeCalledTimes(1);

      await provider.get();

      expect(accessTokenMock.get).toBeCalledTimes(2);

      await provider.get();

      expect(accessTokenMock.get).toBeCalledTimes(3);
    });
  });

  describe('pending 중 토큰값을 요청할 때', () => {
    it('refresh 를 또 다시 수행하지 않는다.', async () => {
      const prmToken1 = provider.get();

      expect(refresherMock).toBeCalledTimes(1);

      refresherMock.mockClear();

      const prmToken2 = provider.get();

      expect(refresherMock).not.toBeCalled();

      await Promise.all([prmToken1, prmToken2]);
    });

    it('두번째로 요청 받은 값은 Async Queue 에서 보내준 값이다.', async () => {
      let resolver: PromiseResolver<string>;

      asyncQueueMock.awaiting.mockImplementationOnce(
        () =>
          new Promise<string>((resolve, reject) => {
            resolver = {
              resolve,
              reject,
            };
          })
      );

      const prmToken1 = provider.get();

      expect(asyncQueueMock.awaiting).not.toBeCalled();

      const prmToken2 = provider.get();

      expect(asyncQueueMock.awaiting).toBeCalled();

      setTimeout(() => {
        resolver.resolve('lookpin!');
      }, 5);

      const result = await Promise.all([prmToken1, prmToken2]);

      expect(result[1]).toBe('lookpin!');
    });
  });

  describe('토큰 만료시 동작', () => {
    beforeEach(() => {
      provider.set(AUTH_TOKEN_DTO);
    });

    it('가져올 엑세스 토큰이 만료 되었다면 refresh 를 자체적으로 수행한다.', async () => {
      const refreshFnMock = vi.spyOn(provider, 'refresh');

      accessTokenMock.get.mockReturnValueOnce('');

      expect(refresherMock).not.toBeCalled();

      await provider.get();

      expect(accessTokenMock.get).toBeCalled();
      expect(refreshFnMock).toBeCalled();

      refreshFnMock.mockRestore();
    });

    it('엑세스 토큰 만료로 refresh 도중 오류가 발생된다면 그 내용을 catch 에 전달한다.', async () => {
      accessTokenMock.get.mockReturnValueOnce('');
      refresherMock.mockRejectedValueOnce(new Error('lookpin!'));

      await expect(provider.get()).rejects.toThrowError('lookpin!');

      expect(accessTokenMock.get).toBeCalled();
      expect(refresherMock).toBeCalled();
    });

    it('엑세스 토큰과 리프레시 토큰 2개 모두 만료 되었다면 오류를 일으킨다.', async () => {
      accessTokenMock.get.mockReturnValueOnce('');
      refreshTokenMock.get.mockReturnValueOnce('');

      await expect(provider.get()).rejects.toThrowError(
        RefreshableJWTProvider.MSG_LOGIN_REQUIRED
      );

      expect(accessTokenMock.get).toBeCalled();
      expect(refreshTokenMock.get).toBeCalled();
      expect(refresherMock).not.toBeCalled();
    });
  });

  describe('clear 수행', () => {
    it('refreshed 된 후에 clear 수행 시 상태가 초기화된다.', async () => {
      await provider.get();

      expect(provider.refreshed).toBe(true);

      provider.clear();

      expect(provider.refreshed).toBe(false);
    });
  });

  describe('setter 동작', () => {
    it('토큰값을 직접 설정 시 refreshed 상태가 true 가 된다.', () => {
      expect(provider.refreshed).toBe(false);

      provider.set(AUTH_TOKEN_DTO);

      expect(provider.refreshed).toBe(true);
    });
    it('직접 설정 후 토큰값을 가져오면 refresh 를 수행하지 않는다.', async () => {
      provider.set(AUTH_TOKEN_DTO);

      await provider.get();

      expect(refresherMock).not.toBeCalled();
    });
    it('직접 설정된 토큰값은 내부 토큰제공자에 설정되고 이 곳에서 가져온다.', async () => {
      const sampleToken = 'world best shopping mall, lookpin!';
      accessTokenMock.get.mockReturnValue(sampleToken);

      provider.set({
        accessToken: sampleToken,
        refreshToken: 'theson',
      });

      const result = await provider.get();

      expect(accessTokenMock.set).toBeCalledWith(sampleToken, undefined);
      expect(accessTokenMock.get).toBeCalledTimes(1);

      expect(result).toBe(sampleToken);
    });
  });
});
