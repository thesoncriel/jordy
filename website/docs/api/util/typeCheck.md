---
sidebar_position: 1
---

# TypeCheck

## isUndefined 
- 값이 undefined인지 확인한다.

### type

```ts
function isUndefined(val: unknown) : boolean
```

### example

```ts
isUndefined(undefined); // true

isUndefined(''); // false
```

---

## isString 
- 값이 string인지 확인한다.

### type
```ts
function isString(val: unknown) : boolean
```

### example
```ts
isString(''); // true

isString(null); // false
```

---

## isNullable
- 값이 undefined or null인지 확인한다.
- 내용이 문자열 'undefined' or 'null'이어도 판단한다.

### type
```ts
function isNullable(val: unknown) : boolean
```

### Example
```ts
isNullable(undefined); // true
isNullable('undefined'); // true

''); // false
```

---

## isEmptyArray
- 값이 빈 배열인지 확인한다.

### type
```ts
function isEmptyArray(val: unknown) : boolean
```

### example
```ts
isEmptyArray([]); // true

isEmptyArray([1]); // false
isEmptyArray(''); // false
```

---

## isNumber
- 값이 숫자인지 확인한다.

### type
```ts
function isNumber(val: unknown) : boolean
```

### example
```ts
isNumber(1); // true

isNumber('1'); // false
```

---

## isNumberLike
- 값이 순수 숫자 or 문자열로 된 숫자인지 확인한다.

### type
```ts
function isNumberLike(val: unknown) : boolean
```

### example
```ts
isNumberLike(1); // true
isNumberLike('1'); // true

isNumberLike('오5') // false
```

---

## isEmptyObject
- 값이 빈 객체인지 확인한다.

### type
```ts
function isEmptyObject(val: unknown) : boolean
```

### example
```ts
isEmptyObject({}); // true

isEmptyObject({ name : 'jordy' }); // false
isEmptyObject(null); // false
isEmptyObject(undefined); // false
```

---

## isFunction
- 값이 호출 가능한 함수인지 확인한다.

### type
```ts
function isFunction(val: unknown) : boolean
```

### example
```ts
isFunction(() => {}); // true

isFunction({ name : 'jordy' }); // false
isFunction(null); // false
isFunction(undefined); // false
```

---

## isObject
- 값이 객체인지 확인한다.

### type
```ts
function isObject(val: unknown) : boolean
```

### example
```ts
isObject({ name : 'jordy' }); // true
isObject({}); // true

isObject(null); // false
isObject(() => {}); // false
```
