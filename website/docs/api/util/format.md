---
sidebar_position: 5
---

# Format

## numberFormat
- 숫자값을 3자리마다 쉼표가 찍힌 문자열로 변경한다.

### type
```ts
function numberFormat(value: number, default = '0' ): string
```

### example
```ts
numberFormat(10000);
// '10,000'

numberFormat(0);
// `default` 반환

numberFormat('50000');
// `default` 반환
```