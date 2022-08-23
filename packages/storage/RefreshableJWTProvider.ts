import { HttpRestError } from '../types';
import { JWTAuthTokenDto, JWTProvider, TokenProvider } from './storage.type';
import { AsyncQueue } from '../util/AsyncQueue';
import { isJWTAuthTokenDto } from './storage.util';

export class RefreshableJWTProvider implements JWTProvider {
  public static readonly MSG_LOGIN_REQUIRED = '로그인이 필요합니다.';

  private _refreshed = false;
  public get refreshed(): boolean {
    return this._refreshed;
  }

  private _pending = false;
  public get pending(): boolean {
    return this._pending;
  }

  public get accessToken(): string {
    return this.accessTokenProvider.get();
  }

  public get refreshToken(): string {
    return this.refreshTokenProvider.get();
  }

  constructor(
    private accessTokenProvider: TokenProvider,
    private refreshTokenProvider: TokenProvider,
    private asyncQueue: AsyncQueue<string>,
    private tokenRefresher: (refreshToken: string) => Promise<JWTAuthTokenDto>
  ) {}

  async refresh() {
    const defaultErrorMessage = RefreshableJWTProvider.MSG_LOGIN_REQUIRED;
    const token = this.refreshToken;

    if (token) {
      try {
        const nextToken = await this.tokenRefresher(token);

        if (isJWTAuthTokenDto(nextToken)) {
          return nextToken;
        }
      } catch (error) {
        throw HttpRestError.from(error, 'auth');
      }
    }

    throw new HttpRestError(defaultErrorMessage, 'auth');
  }

  set(tokenValue: JWTAuthTokenDto): void {
    this.accessTokenProvider.set(tokenValue.accessToken);
    this.refreshTokenProvider.set(
      tokenValue.refreshToken,
      tokenValue.refreshTokenExpiredDate
    );
  }
  async get(): Promise<string> {
    if (this._refreshed) {
      const currToken = this.accessTokenProvider.get();

      if (currToken) {
        return currToken;
      }
    } else if (this._pending) {
      return this.asyncQueue.awaiting();
    }
    this._refreshed = false;
    this._pending = true;

    try {
      const value = await this.refresh();

      this.set(value);

      this._pending = false;
      this._refreshed = true;

      if (this.asyncQueue.has()) {
        this.asyncQueue.resolveAll(value.accessToken);
      }

      return value.accessToken;
    } catch (error) {
      this._pending = false;
      this._refreshed = false;

      if (this.asyncQueue.has()) {
        this.asyncQueue.rejectAll(error);
      }

      throw error;
    }
  }
  clear(): void {
    this._refreshed = false;
    this._pending = false;
    this.accessTokenProvider.clear();
    this.refreshTokenProvider.clear();
  }
}
