# Deep Copy vs Shallow Copy

> 깊은 복사와 얕은 복사

## 배경

깊은 복사와 얕은 복사는 너무도 말이 많지만 이해하기 까다롭고, 까먹기고 자주 까먹는 개념이라고 생각한다. 솔직하게 나도 여러 번 보고 이해했지만 볼 때마다 까먹고 다시 이해하는 개념 중에 하나인 것 같다. 그런데 왜 갑자기 이 개념을 고민하게 되었을까?

`Array.from()` 에 대한 문서를 보던 중 이런 말이 나왔다.

> The Array.from() static method creates a new, `shallow-copied` Array instance from an iterable or array-like object.

잉? 얕은 복사라고? 음? Array.from()이 얕은 복사된 배열 인스턴스를 생성한다고? 뭔가 내 머릿 속에서 이해가 잘 되질않았다. 그래서 우선 얕은 복사의 개념을 다시 한 번 정리해보고자 한다.

## 깊은 복사, 얕은 복사란

일반적으로 **원시타입(값)** 의 복사는 모두 깊은 복사이다. 즉 값이 복사되고 원래 값과 복사된 값이 서로 영향을 미치지 않는다. 이런 경우는 깊은 복사라고 말한다.

```js
let a = 10;
let b = a;
console.log(a, b); // 10, 10
b = 20;
console.log(a, b); // 10, 20 → a, b 영향 미치지 않음
```

그렇다면, 객체인 배열을 복사해보자.

```js
const a = [1, 2, 3];
const b = a;
console.log(a, b); // [1,2,3], [1,2,3]
b[0] *= 10;
b[1] *= 20;
b[2] *= 30;
console.log(a, b); // [10,40,90], [10,40,90]
```

코드에서 보이듯, 원래 배열과 복사된 배열의 요소가 모두 변경되었다. 즉, `const b = a` 를 통해서 b에 복사된 것은 배열의 값들이 아니라 배열을 바라보는 주소값이다.(사실 할당했다 라고 보는게 맞는것 같다.) 그래서 a, b 모두 같은 주소값을 바라보기 때문에 복사된 값을 변경해도 a, b 모두 변경이 일어나게 되는 것이다. 즉 이렇게 복사본이 원본에 영향을 주도록 복사되는 것을 얕은 복사라고 한다.

정리하면 아래와 같다.

- 얕은 복사

  - 객체의 주소값을 복사, 원래값과 복사된 값이 서로 영향을 받는 경우을 말한다. → 메모리 안의 같은 참조값을 바로보고 있다!

  - 객체의 프로퍼티들을 1뎁스까지만 복사

  - 일반적으로 자바스크립트에서의 복사는 모두 얕은 복사 → `… spread operator` `Object.create()`, `Object.assign()`, `Array.from()`, `Array.slice()` 등등

- 깊은 복사

  - 객체의 값 자체를 복사, 원래값과 복사된 값이 서로 영향을 미치지 않는다.

  - 객체의 프로퍼티들을 모든 뎁스에 대해서 복사

  - 깊은 복사를 해야 **immutable** 하다라고 말할 수 있음 → 불변객체 : 매번 새로운 객체를 생성한다는 의미

## 자바스크립트에서 깊은 복사의 방법

- [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) : 새로운 최신 API
- JSON.stringify + JSON.parse 이용 : 효율이 매우 안좋다고 알려져있음
- 객체(or배열)임을 판단하고 재귀함수 알고리즘으로 순회하여 구현 가능 → 직접 구현해보기!
- lodash에 clonedeep 이용

## 내가 이해하기 어려웠던 부분에 대해서

일반적인 자바스크립트 메소드들은 모두 얕은 복사라고 했다. 그런데 이 부분이 사실 이해하기 어려웠다. 왜냐하면 배열 메소드만 봐도, `[1,2,3,4].slice()`를 하면 새로운 배열이 복사되어 나오는데, 이 배열은 원본과 다른 배열이기 때문이다. 여기서 내가 바라보는 관점이 잘못되었음을 알게되었다. slice()메소드가 새로운 배열이 생성되는 것은 맞지만 `그 안에 요소들이 어떻게 복사되는가`를 보는 것이 깊은 복사인지 얕은 복사인지를 판별하는 관점이였던 것이다.

사실 위 코드는 원시값을 복사한 것이라서 당연히 깊은 복사일 수 밖에 없다. 다시 말해 원시값인 경우엔 깊은 복사와 얕은 복사를 따지는 것이 애매해진다. 배열 안의 요소들이 객체인 경우를 생각해봐야한다.

```js
const arr1 = [{ name: 'jjanmo', age: 25 }];
const arr2 = arr1.slice();
arr2[0].age = 35;

console.log(arr1[0], arr2[0]); // ??
```

  <details>
    <summary>OUTPUT</summary>
    
    arr1[0] : {name: 'jjanmo', age: 35}

    arr2[0] : {name: 'jjanmo', age: 35}

  </details>

예상했다 싶이 원본과 복사본 모두 변경되는 것을 확인할 수 있다. 그렇기 때문에 slice() 메소드는 얕은 복사를 하는 것이였다.

이런 관점에서 서두에서 헷갈렸던 부분에 대해서 다시 생각해보면, Array.from()을 유사배열객체나 반복가능한배열의 요소들을 얕게 복사, 즉 1뎁스만큼만 복사하여 새로운 배열에 담아서 주는 메소드인 것이다. 그렇기 때문에 객체나 배열 안의 요소들이 객체라면 이 객체들은 원본과 복사본이 연결되어 있기 때문에 주의를 해야할 것이다.

총정리를 해보면, 복사를 바라볼 때, `객체가 어떻게 복사`되는지를 바라보면 이해가 수월해지는 것 같다. 내가 복사하려고 하는 객체가 어떻게 복사되는지를 따지면 이것이 깊은 복사인지 얕은 복사인지를 정확하게 파악할 수 있을 것이다.

## 참고

- [Javascript Shallow Copy - what is a Shallow Copy?](https://dev.to/smpnjn/javascript-shallow-copy-what-is-a-shallow-copy-1pc5)

- [Deep-copying in JavaScript using structuredClone 번역](https://velog.io/@seonja/StructuredClone%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-JavaScript%EC%97%90%EC%84%9C-%EA%B9%8A%EC%9D%80-%EB%B3%B5%EC%82%AC)
