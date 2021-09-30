import { getFileName, parseQueryString } from '../src/path.util';

describe('getFileName', () => {
  it('주어진 경로의 최하위 경로 값을 반환한다.', () => {
    const given = '/hoho/haha/kaka/whatsThat';
    const result = getFileName(given);

    expect(result).toBe('whatsThat');
  });
  it('유효하지 않은 경로 값이면 받은 값을 되돌려준다.', () => {
    const given = 'hohohaha';
    const result = getFileName(given);

    expect(result).toBe(given);
  });
  it('최하위 경로에 확장자가 있다면 그것도 함께 반환한다.', () => {
    const given = '/hoho/haha/kaka/gowid.pptx';
    const result = getFileName(given);

    expect(result).toBe('gowid.pptx');
  });
  it('최하위 경로 뒷쪽에 각종 파라미터가 있다면 그것을 제외하고 반환한다.', () => {
    const given = '/hoho/haha/kaka/gowid.pptx?key=true&name=theson';
    const result = getFileName(given);

    expect(result).toBe('gowid.pptx');
  });
});

describe('parseQueryString', () => {
  it('일반 문자열이 들어가면 빈 객체를 되돌려준다.', () => {
    const result = parseQueryString('고위드 만쉐이 하하하');

    expect(result).toEqual({});
  });
  it('경로에 쿼리 파라미터가 있다면 그 값들을 객체로 만들어준다.', () => {
    const given = 'https://www.gowid.com/test/haha/?key=koko&name=sulsul';
    const result = parseQueryString(given);

    expect(result).toEqual({
      key: 'koko',
      name: 'sulsul',
    });
  });
  it('파라미터에 URL 인코딩 된 내용이 있다면 제대로 반영한다.', () => {
    const given =
      'https://www.gowid.com/?title=%ED%95%98%ED%95%98%ED%98%B8%ED%98%B8%EA%B0%80%EC%A6%88%EC%95%84!';
    const result = parseQueryString(given);

    expect(result).toEqual({
      title: '하하호호가즈아!',
    });
  });
});
