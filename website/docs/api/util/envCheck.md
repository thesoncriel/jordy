---
sidebar_position: 7
---

# EnvCheck
- 서버, 클라이언트, userAgent 등 유저의 환경 여부를 확인한다.

## isServer
- 서버 환경인지 확인한다.

### type
```ts
function isServer() : boolean
```

### example
```ts
isServer();
// true or false
```

---

## setIsServer
- `isServer()`의 확인 내용을 특정 값으로 설정한다.
- **개발 모드에서만 가능하다.**

### type
```ts
function setIsServer(val: boolean) : void
```

### example
```ts
setIsSever(true);
// isServer() - true

setIsSever(false);
// isServer() - false
```

---

## isStorageAvailable
- 로컬 스토리지 가능 여부를 확인한다.

### type
```ts
function isStorageAvailable() : boolean;
```

### example
```ts
isStorageAvailable();
// true or false
```

---

## setIsStorageAvailable
- `isStorageAvailable()`의 확인 내용을 특정 값으로 설정한다.

### type
```ts
function setIsStorageAvailable(val: boolean) : void;
```

### example
```ts
setIsStorageAvailable(true);
// isStorageAvailable() - true

setIsStorageAvailable(false);
// isStorageAvailable() - false
```

---

## setUserAgent
- user agent 정보를 설정한다.
- **Client Side에서는 무시되며 서버에서 설정한다.**

### type
```ts
function setUserAgent(ua?: string) : void
```

### example
```ts
setUserAgent(userAgent);
// userAgent 정보를 넣는다.
```

---

## getUserAgent
- user agent 정보를 가져온다.
- Server Side의 경우, 반드시 `setUserAgent()`로 값을 줘야한다.
- Client Side의 경우, window.navigator.userAgent 값을 반환한다.

### type
```ts
function getUserAgent() : string
```

### example
```ts
getUserAgent();
// userAgent..
```

---

## isMobile
- user agent 기반으로 모바일 여부를 확인한다.
- `/iPhone|iPod|Android/.test(ua)`

### type
```ts
function isMobile() : boolean;
```

### example
```ts
isMobile();
// true or false
```

---

## isTablet
- user-agent 정보를 이용하여 태블릿 여부를 판단한다.
- 아직 Android 태블릿 여부는 확인이 불가하다. (ipad 만 가능)

### type
```ts
function isTablet() : boolean;
```

### example
```ts
isTablet();
// true or false
```

---

## isIOS
- user-agent 정보를 이용하여 ios 여부를 판단한다.

### type
```ts
function isIOS() : boolean;
```

### example
```ts
isIOS();
// true or false
```

---

## setNativeAppKeyword

### type
```ts
function setNativeAppKeyword(keyword: string) : void;
```

### example
```ts
setNativeAppKeyword('blah blah');
```

---

## isNativeApp
- user-agent 정보를 이용하여 native app 여부를 판단한다.

### type
```ts
function isNativeApp() : boolean;
```

### example
```ts
isNativeApp();
// true or false
```

---