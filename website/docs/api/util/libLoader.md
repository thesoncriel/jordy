---
sidebar_position: 3
---

# LibLoader
- 외부 라이브러리를 호출한다.

### type
```ts
function loadOuterScript(url: string) : Promise<boolean>
```

### example

```ts
async function loadLib() {
    const loaded = await loadOuterScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')

    if (loaded) {
        // ... success
    }
}
```