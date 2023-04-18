export interface JWTAuthTokenDto {
  accessToken: string;
  accessTokenExpiredDate?: string;
  refreshToken: string;
  refreshTokenExpiredDate?: string;
}

/**
 * JWT 를 제공한다.
 */
export interface JWTProvider {
  /**
   * 새로고침 했는지 여부
   */
  readonly refreshed: boolean;
  /**
   * 새로고침 진행중 여부
   */
  readonly pending: boolean;
  /**
   * 액세스 토큰. 비어있다면 아직 가져오지 않은 것이다.
   */
  readonly accessToken: string;
  /**
   * 리프레시 토큰. 비어있다면 아직 가져오지 않은 것이다.
   */
  readonly refreshToken: string;
  /**
   * 토큰값을 설정한다.
   * @param tokenValue
   */
  set(tokenValue: JWTAuthTokenDto): void;
  /**
   * 엑세스 토큰값을 가져온다.
   * 
   * @throws 가져오는데 실패 했다면 오류를 일으킨다.
   */
  get(): Promise<string>;
  /**
   * 설정된 토큰 정보를 모두 삭제한다.
   */
  clear(): void;
}
