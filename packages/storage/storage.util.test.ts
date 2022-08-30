import { isJWTAuthTokenDto } from './storage.util';

describe('isJWTAuthTokenDto - 토큰 정보 유효성 검사', () => {
  it.each([
    [
      '정상적인 데이터',
      {
        accessToken: 'token0',
        accessTokenExpiredDate: '2022-06-01T12:00:00.000+09:00',
        refreshToken: 'token1',
        refreshTokenExpiredDate: '2022-06-01T12:00:00.000+09:00',
      },
      true,
    ],
    [
      '잘못된 필드',
      {
        accessToken: 'blahblah',
        accessTokenExpiredDate: null,
        refresh_token: 'blahblah',
      },
      false,
    ],
    [
      '빈 객체', //
      {},
      false,
    ],
    [
      'null 값', //
      null,
      false,
    ],
    [
      '빈 문자열', //
      '',
      false,
    ],
    [
      'html 코드', //
      `<html>
<head>
</head>
<body>
<div>블라블라..</div>
</body>
</html>
      `,
      false,
    ],
  ])('%s', (_, given, expects) => {
    const result = isJWTAuthTokenDto(given);

    expect(result).toBe(expects);
  });
});
