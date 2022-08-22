---
sidebar_position: 4
---

# Josa
- 한국어의 조사인 '을/를', '이/가'를 문맥에 맞게 변형한다.
- 해당 라이브러리를 참조하였다. 
  - https://github.com/e-/Josa.js/blob/master/josa.js

## josa.c
- `word`에 맞는 조사를 반환한다.

### type
```ts
(word: string, format: JosaResultType) : string
```

### example
```ts
josa.c('조르디', '은/는');
// 는
```

---

## josa.r
- `word`와 맞는 조사를 합성해 반환한다.

### type
```ts
(word: string, format: JosaResultType) : string
```

```ts
josa.r('사과', '을/를');
// 사과를
```