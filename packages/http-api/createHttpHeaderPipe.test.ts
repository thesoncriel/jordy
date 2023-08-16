import { JWTProvider } from '../jwt/jwt.type';
import { TokenProvider } from '../storage/storage.type';
import { setIsServer } from '../util/envCheck';
import { createHttpHeaderPipe } from './createHttpHeaderPipe';

describe('createHttpHeaderPipe', () => {
  const TOKEN = 'bearer blah_blah';
  const MSG_ERROR = 'login please';

  const tokenProvider = {
    type: 'TokenProvider',
    get: vi.fn(() => TOKEN),
    set: vi.fn(),
    clear: vi.fn(),
  };
  const jwtProvider = {
    type: 'JWTProvider',
    refreshed: false,
    pending: false,
    accessToken: '',
    refreshToken: '',
    set: vi.fn(),
    get: vi.fn().mockResolvedValue(TOKEN),
    clear: vi.fn(),
  };
  const pipeMock1 = vi.fn((data: Map<string, string>) => {
    return data.set('name', 'lookpin');
  });
  const pipeMock2 = vi.fn((data: Map<string, string>) => {
    return data.set('age', '21');
  });
  const pipeMock3 = vi.fn((data: Map<string, string>, token = '') => {
    if (token) {
      data.set('token', token);
    }
    return data;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.each([
    ['TokenProvider', tokenProvider],
    ['JWTProvider', jwtProvider],
  ])('%s 적용 테스트', (_, provider) => {
    const headerPipe = createHttpHeaderPipe(
      provider as TokenProvider | JWTProvider,
      MSG_ERROR
    );

    it('적용된 모든 오퍼레이터들을 1번씩 수행한다.', async () => {
      await headerPipe(pipeMock1, pipeMock2, pipeMock3);

      expect(pipeMock1).toBeCalledTimes(1);
      expect(pipeMock2).toBeCalledTimes(1);
      expect(pipeMock3).toBeCalledTimes(1);
    });

    it('만들어진 헤더는 오퍼레이터에서 제공된 내용을 기반으로 만들어진다.', async () => {
      pipeMock1.mockImplementationOnce((data) => {
        return data.set('gameName', 'sonic3');
      });
      pipeMock2.mockImplementationOnce((data) => {
        return data.set('genre', 'action');
      });
      const result = await headerPipe(pipeMock1, pipeMock2);

      expect(result).toEqual({
        gameName: 'sonic3',
        genre: 'action',
      });
    });

    it('오퍼레이터를 주지 않으면 빈 객체를 만든다.', async () => {
      const result = await headerPipe();

      expect(result).toEqual({});
    });

    it('헤더 생성 시 적용된 토큰 제공자를 이용한다.', async () => {
      await headerPipe(pipeMock1, pipeMock2, pipeMock3);

      expect(provider.get).toBeCalledTimes(1);
    });

    it('생성된 헤더에 토큰 제공자의 토큰값이 포함된다.', async () => {
      const token = 'some auth token';

      if (provider.type === 'JWTProvider') {
        provider.get.mockResolvedValueOnce(token);
      } else {
        provider.get.mockImplementationOnce(() => token);
      }

      const result = await headerPipe(pipeMock1, pipeMock2, pipeMock3);

      expect(result).toHaveProperty('token', token);
    });

    it('토큰 제공자의 토큰값이 비었다면 오류를 일으킨다.', async () => {
      setIsServer(false);

      if (provider.type === 'JWTProvider') {
        provider.get.mockResolvedValueOnce('');
      } else {
        provider.get.mockImplementationOnce(() => '');
      }

      await expect(
        headerPipe(pipeMock1, pipeMock2, pipeMock3)
      ).rejects.toThrowError(MSG_ERROR);

      setIsServer(true);
    });

    it('토큰 제공자에서 오류가 발생되면 그 오류 내용을 그대로 전달한다.', async () => {
      let msg = '';

      if (provider.type === 'JWTProvider') {
        msg = 'oops!!';
        provider.get.mockRejectedValueOnce(new Error(msg));
      } else {
        msg = 'what?!';
        provider.get.mockImplementationOnce(() => {
          throw new Error(msg);
        });
      }

      await expect(
        headerPipe(pipeMock1, pipeMock2, pipeMock3)
      ).rejects.toThrowError(msg);
    });
  });
});
