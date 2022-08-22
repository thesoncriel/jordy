---
sidebar_position: 2
---

# QueryString
- Query String을 조작하는 유틸리티 모음

본 라이브러리의 qs 구현체는 npm의 `qs` 라이브러리와는 관계가 없습니다.

qs와 주요 방식은 일정하나 업무에 맞춰 간략화 되어 있습니다.

특히, `qs.parse`의 경우 내부적으로 캐싱을 포함합니다.


## qs

### type
```ts
interface QueryString {
  parse(url: string): Record<string, string>;
  serialize<T = Record<string, unknown>>(
    params: T,
    withQuestionMark?: boolean
  ): string;
  append(search: string, data: Record<string, unknown>): string;
}
```

---

## qs.parse

- 특정 URL의 쿼리 파라미터를 객체 형식으로 변경한다.
- 만약 쿼리 파라미터가 없으면 빈 객체를 반환한다.

### type
```ts
(url: string) : Record<string, string>
```

### example

```ts
qs.parse('normal string');
// {}

qs.parse('https://www.theson.com/test/haha/?key=koko&name=jordy');
// { key: 'koko', name: 'jordy' }
```

---

## qs.serialize
- 쿼리 파라미터를 문자열로 변경한다.
- 값에 null, undefined, NaN이라면 빈 값으로 처리된다.

### type
```ts
<T = Record<string, unknown>>(params: T, withQuestionMark: boolean) : string
```

### example
```ts
qs.serialize({ key: 'koko', name: 'jordy' });
// key=koko&name=jordy

qs.serialize({ key: 'koko', name: 'jordy' }, true);
// ?key=koko&name=jordy
```

---

## qs.append
- 검색 문자열에 쿼리 파라미터를 덧붙인다.

### type
```ts
(search: string, data: Record<string, unknown>) : string;
```

### example
```ts
qs.append('?key=koko&name=jordy', { age: 20 });
// ?key=koko&name=jordy&age=20

qs.append('key=koko&name=jordy', { age: 20 });
// Error! 첫 인자에는 '?'가 포함되어야 한다.
```