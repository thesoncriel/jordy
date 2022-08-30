const pipeHeaderDataCurried =
  (key: string, value: string) => (headerData: Map<string, string>) => {
    return headerData.set(key, value);
  };

export const httpHeaderOperator = {
  /**
   * ### 헤더 오퍼레이터
   * 아래와 같은 데이터가 추가 된다.
   *
   * Accept: 'application/json'
   * @param headerData 데이터를 추가 할 헤더
   */
  acceptContentType: pipeHeaderDataCurried(
    'Accept', //
    'application/json'
  ),
  /**
   * ### 헤더 오퍼레이터
   * 아래와 같은 데이터가 추가 된다.
   *
   * Content-Type = 'application/x-www-form-urlencoded'
   * @param headerData 데이터를 추가 할 헤더
   */
  contentTypeFormPost: pipeHeaderDataCurried(
    'Content-Type',
    'application/x-www-form-urlencoded'
  ),
  /**
   * ### 헤더 오퍼레이터
   * 아래와 같은 데이터가 추가 된다.
   *
   * Content-Type = 'multipart/form-data'
   * @param headerData 데이터를 추가 할 헤더
   */
  contentTypeFormMultipart: pipeHeaderDataCurried(
    'Content-Type',
    'multipart/form-data'
  ),
  /**
   * ### 헤더 오퍼레이터
   * 아래와 같은 데이터가 추가 된다.
   *
   * Content-Type = 'application/json; charset=utf-8'
   * @param headerData 데이터를 추가 할 헤더
   */
  contentTypeJson: pipeHeaderDataCurried(
    'Content-Type',
    'application/json; charset=utf-8'
  ),
  /**
   * ### 헤더 오퍼레이터
   * Bearer 토큰이 필요할 때 사용된다.
   *
   * 전달된 토큰 값이 비어있다면 키와 값을 설정하지 않는다.
   * @param headerData 데이터를 추가 할 헤더
   * @param token 사용될 베어러 토큰.
   */
  bearerToken: (headerData: Map<string, string>, token?: string) => {
    if (token) {
      headerData.set('Authorization', `Bearer ${token}`);
    }

    return headerData;
  },
};
