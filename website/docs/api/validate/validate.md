# Validate
- form에 대한 Validation을 한번에 관리한다.


## validate
### type
```ts
function validate<T>(
    state: T,
    opt: ValidateBulkOptionType<T>
    ): ValidateBulkResultModel {
        return {
            /**
             * 전체 유효성 검증 통과 여부. true 면 통과, false 면 아님
             */
            isValid: boolean;
            /**
             * 각 필드별 결과. key 로 접근할 수 있다.
             */
            results: Record<string, ValidateResultModel>;
            /**
             * 유효했던 키 목록
             */
            validKeys: string[];
            /**
             * 유효성 실패된 키 목록
             */
            invalidKeys: string[];
            /**
             * 여러 유효성 메시지 중 가장 첫번째 것을 담고 있다.
             */
            firstMessage: string;
        }
    }
```

### example
```ts
import { validate } from 'ts-fe-toolkit';

interface UserModel {
    name: string;
    phone: string;
    password: string;
}

function execValidation(user: UserModel) {
    return validate(user, {
    // 한가지 검증일 땐 객체로 넘겨준다.
    name: {
        // check 가 false 일 때 알려줄 메시지
        message: '이름을 채워주세요.',
        // 유효성 검사. 결과가 true 면 유효성이 검증된 것이다.
        check: val => validate.fn.empty(val),
    },
    // phone 이 필수가 아니라면 생략한다.
    
    // 여러가지 형태를 검증하고 메시지를 다르게 주고 싶을 땐 배열로 넘겨준다.
    password: [
        {
        message: '비밀번호를 입력하세요',
        check: val => validate.fn.empty(val),
        },
        {
        message: '비밀번호가 유효하지 않습니다.',
        check: val => validate.fn.password(val),
        },
    ]
    });
}

function handleSubmit () {
    const result = execValidation(user);

    if (!result.isValid) {
        /** ... validation 로직 */
        return;
    }

    fetch(result.results);
}

```


---

## mergeValidates

- validate로 검증한 결과를 하나의 결과로 병합한다.
- 병합 후엔 `ValidateBulkResultModel` 타입으로 만들어진다.

### type
```ts
function mergeValidates(...args: ValidateBulkResultModel[]): ValidateBulkResultModel
```

### example
```ts
const result = mergeValidates(
    execValidation1(data1),
    execValidation2(data2),
    execValidation3(data3)
)

if (result.isValid) {
    /** ... fetch */
}
```