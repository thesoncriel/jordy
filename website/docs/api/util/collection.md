---
sidebar_position: 8
---

# Collection
- Spread Operator로 복사된 배열을 반환한다.

## reorder
- 주어진 배열 내 특정 Index를 원하는 Index로 이동시킨다.
- sortable ui 결과를 이용할 때 쓰인다.

### type
```ts
function reorder<T>(list: T[], startIndex: number, endIndex: number) : T[] 
```

### example
```ts
const array = [1,2,3,4];
reorder(array, 1, 3);
// [1,3,4,2]
// index 1의 값 2를 index 3으로 이동시켰다.
```

---

## update
- 주어진 배열의 특정 인덱스에 대하여 제시된 아이템 내용으로 업데이트한다.

### type
```ts
function update<T>(list: T[], index: number, item: T) : T[]; 
```

### example
```ts
const array = [1,2,3,4];
update(array, 3, 10);
// [1,2,3,10]
```


---

## remove
- 주어진 배열에서 특정 인덱스의 아이템을 삭제한다.

### type
```ts
function remove<T>(list: T[], index: number) : T[]; 
```

### example
```ts
const array = [1,2,3,4];
update(array, 3);
// [1,2,3]
```
