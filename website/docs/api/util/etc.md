---
sidebar_position: 6
---

# Etc

## timeout
- 특정 시간만큼 지연한다.
- 특정 시간이 지난 후 비동기로 특정 값을 전달한다.

### type
```ts
function timeout<T = void>(
            time: number,
            value?: T,
            stopCallback?: (stop: () => void) => void
        ): Promise<T>
```

### example
```ts
await timeout(100);
// 100ms 지연

await timeout(100, { name: 'jordy' });
// 100ms 이후 2번째 인자 값 전달
// { name: 'jordy' } 
```

---

## noop
- 아무것도 수행하지 않는 빈 함수

### type
```ts
function noop() : void;
```

### example
```html
<button onClick={noop}>example</button>
```