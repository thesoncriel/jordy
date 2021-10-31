// 출처: https://github.com/e-/Josa.js/blob/master/josa.js

function _hasJong(string: string) {
  //string의 마지막 글자가 받침을 가지는지 확인
  const str = string.charCodeAt(string.length - 1);
  return (str - 0xac00) % 28 > 0;
}

const _f = [
  function (string: string) {
    //을/를 구분
    return _hasJong(string) ? '을' : '를';
  },
  function (string: string) {
    //은/는 구분
    return _hasJong(string) ? '은' : '는';
  },
  function (string: string) {
    //이/가 구분
    return _hasJong(string) ? '이' : '가';
  },
  function (string: string) {
    //와/과 구분
    return _hasJong(string) ? '과' : '와';
  },
  function (string: string) {
    //으로/로 구분
    return _hasJong(string) ? '으로' : '로';
  },
];

const _formats = {
  '을/를': _f[0],
  을: _f[0],
  를: _f[0],
  을를: _f[0],
  '은/는': _f[1],
  은: _f[1],
  는: _f[1],
  은는: _f[1],
  '이/가': _f[2],
  이: _f[2],
  가: _f[2],
  이가: _f[2],
  '와/과': _f[3],
  와: _f[3],
  과: _f[3],
  와과: _f[3],
  '으로/로': _f[4],
  으로: _f[4],
  로: _f[4],
  으로로: _f[4],
};

type JosaResultType = keyof typeof _formats;

/**
 * Josa.js는 한국어 조사인 은/는, 을/를, 이/가, 와/과를 구분해주는 자바스크립트 라이브러리입니다.
 *
 * https://github.com/e-/Josa.js/
 */
export const josa = {
  /**
   * word와 format에 해당하는 조사를 돌려줍니다.
```ts
Josa.c('사과','을/를'); // '를'
Josa.c('귤','이/가'); // '이'
Josa.c('바나나','은/는'); // '는'
Josa.c('딸기','와/과'); // '와'
```
Josa.c의 반환값에는 word 자체는 포함되지 않는다는걸 주의하세요. word 자체를 포함하려면 Josa.r을 사용하세요.

format에는 '이/가', '은/는', '을/를', '와/과' 를 사용할 수 있고 짧은 이름도 가능합니다.

```ts
Josa.c('사과','을/를'); // '를'
Josa.c('사과','을'); // '를'
Josa.c('사과','를'); // '를'
Josa.c('사과','을를'); // '를'
```
   * @param word 
   * @param format 
   * @returns 
   */
  c: function (word: string, format: JosaResultType) {
    if (typeof _formats[format] === 'undefined') throw 'Invalid format!';
    return _formats[format](word);
  },
  /**
   * Josa.c와 비슷하나 word를 포함한 결과값을 돌려줍니다.
```ts
Josa.r('사과','을/를'); // '사과를'
Josa.r('귤','이/가'); // '귤이'
```
   * @param word 
   * @param format 
   * @returns 
   */
  r: function (word: string, format: JosaResultType) {
    return word + josa.c(word, format);
  },
};
