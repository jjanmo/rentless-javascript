# Promise.allSettled 에 대한 이해

## 배경

여러 개의 데이터를 여러 번의 비동기 fetch를 통해서 받아오기 위해서 다양한 방법들이 있을 수 있다. 그 중에서 나는 `Promise.allSettle()` 메소드를 사용하였는데, 데이터를 받는 과정에서 최종 데이터 값을 제대로 받아올 수 없었다. 중간에 자꾸 최종 결과값이 아닌 `Promise를 가진 배열을 받아오게 되는 것`이였다. 왜 타입이 저렇게 되는건지 혹은 왜 내가 원하는대로 값을 받아올 수 없는건지 등에 대해서 따져보고 분석해보았다. 그러면서 Promise와 async-await 그리고 fetch API에 대해서 조금 더 알 수 있는 기회가 되었다. 이러한 과정을 한번 정리해보고자 한다.

## Solutions

### 1번의 API 콜로 1개의 데이터 받아오기

> 일반적으로 사용하는 fetch()를 말한다.

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// 1)
(async function fetchPost() {
  const response = await fetch(`${BASE_URL}/2`);
  const result = await response.json();
  console.log(result);
})();

// 2)
(function fetchPost() {
  fetch(`${BASE_URL}/2`).then((res) => res.json().then((data) => console.log(data)));
})();
```

두가지의 형식이 있는데, 첫번째는 async/await을 이용하는 방법과 두번째는 promise chain을 이용하는 방법이다. 보는바와 같이 async/await가 훨씬 가독성도 좋고 내가 원하는 값을 분리하여 사용할 수 있다. 또한 동기적인 코드로 읽을 수 있다는 장점이 있다.(단, 동기코드 변경된 것은 아니다.) 반면에 promise chain은 예전의 콜백지옥에 비해서는 좋아졌지만, 그럼에도 최종 결과값을 사용하기 위해선 체인 안으로 들어가야하기 때문에 약간의(?) 수고스러움이 있을 수 있다.

### 여러 개의 콜을 받아오는 방법들

> `여러 개의 프로미스를 집계할 때` 사용할 수 있는 다양한 코드들

#### solution1 : `for loop`

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postIds = [1, 2, 5];

(async function fetchPosts() {
  const results = [];
  for (let i = 0; i < postIds.length; i++) {
    const response = await fetch(`${BASE_URL}/${postIds[i]}`);
    const result = await response.json();
    results.push(result);
  }

  console.log(results);
})();
```

코드가 러프하지만 잘 돌아간다. 결과값은 3개의 post객체 배열에 담아서 보여준다. 이 코드의 장점(?)은 코드가 `단계적으로, 순차적으로` 돌아간다는 것이다. 다시 말해, `i가 0부터 2까지 하나씩 실행되고 마무리하고를 반복`한다. 그런데 뭔가 좀 더 샤프한(?) 코드 없을까에 대한 고민이 생긴다. 좀 더 선언적인(?) 코드로 변경 할 수 없을까?

#### solution2 : Array 메소드 이용

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postIds = [1, 2, 5];

(async function fetchPosts() {
  const results = [];
  postIds.forEach(async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    const result = await response.json();
    results.push(result);
  });

  console.log(results);
})();
```

위 코드는 제대로 동작을 할까? results는 잘 찍힐까? 아니다. 위 결과는 `[]` 빈배열이 찍힌다. 왜 그럴까? 내가 예상하는 forEach의 동작은 각각의 콜백함수에서 순차적으로 await를 만나면 멈추고 값을 도출한 후 값을 results에 넣고 하는 작업을 반복하는 것을 상상하였다. 하지만 실제는 그렇지 않았다. 로그를 찍어보면 이렇다.

```js
(async function fetchPosts() {
  const results = [];
  postIds.forEach(async (id) => {
    console.log(`${id} 시작`);
    const response = await fetch(`${BASE_URL}/${id}`);
    const result = await response.json();
    console.log('fetched id', result.id);
    results.push(result);
    console.log(`${id} 끝`);
  });

  console.log(results);
})();
```

> 위 코드의 결과 이미지

![result](/screenshots/7-2.png)

왜 이러한 결과가 나타날까? 그것은 배열의 메소드의 콜백함수에 async/await을 붙여도 제대로 동작하지 않는데 있다. forEach가 어떻게 구현되어있는지를 보면 그 이유를 좀 더 명확히 알 수 있다. (참고 [forEach 폴리필](https://developer.mozilla.org/ko/docs/Web/API/NodeList/forEach#polyfill)) forEach에서의 콜백은 내가 예상했던 것처럼 값을 받기 위해서 멈추고 하는 로직이 포함되어 있지않다. 단지 콜백함수를 순차적으로 실행시켜주면 끝나게 된다. 그래서 순차적으로 콜백함수가 시작되는 것을 `시작` 로그를 통해서 확인할 수 있다. 그렇게 콜백함수를 모두 실행하면 forEach는 자신의 임무를 마치고 그 다음 코드를 읽게 된다. 그래서 빈배열을 가진 results가 로그에 찍히게 되는 것이다. 하지만 아직 어디선가 실행되지 않은 콜백함수 내부의 코드들이 존재한다.(해당 코드는 백그라운드에 존재하다가 콜스택이 비게되는 경우, 실행완료된 순서대로 올라오는 것으로 예상된다.) 콜백함수가 순차적으로 실행되었다고 해서 fetch가 순차적으로 완료되는 것은 아니다. 네트워크 환경에 따라서 어떤 것이 먼저 값을 줄지 알 수 없다. 그래서 `끝` 로그는 순차적이지 않게 찍히는 것을 확인할 수 있다.

(이외에도 다른 배열 메소드의 콜백에도 async/await을 붙이게 되면 제대로 동작하지않을 것이다.)

그렇다면 어떤 방법으로 위와 같은 이슈를 해결할 수 있을까? (for문 제외 🤪)

#### solution3 : Promise.allSettled

> 드디어 내가 궁금했던 부분 등장

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postIds = [1, 2, 5];

(async function fetchPosts() {
  const promises = postIds.map((id) => fetch(`${BASE_URL}/${id}`));
  const results = await Promise.allSettled(promises)
    .then((responses) => responses.map((response) => response.value))
    .then(async (responses) => {
      const results = [];
      for (let response of responses) {
        const result = await response.json();
        results.push(result);
      }
      return results;
    });

  console.log(results);
})();
```

우선 위 코드를 보기 앞서, Promise API에 대해서 알아보자.

- Promise.all(promises)

  - 프라미스 배열(정확히는 이터러블 객체)를 받고 프라미스를 반환. 배열 안 프라미스가 모두 처리되고 프라미스의 결괏값을 담은 배열이 새로운 프라미스가 되어서 리턴.

  - 배열 안의 프라미스 순서를 변경시키지 않는다. 각각의 프라미스의 이행 속도에 관계없이 인자로 들어간 배열 순서에 맞게 결괏값이 전달된다.

  - 프라미스 배열 중 한 개라도 시행이 거부되면 전체 시행이 거부된다. 단, 다른 프로미스 호출에 대해서 신경을 쓰지 않는 것이지 실행이 취소되는 것은 아니다. 또한 전체 결괏값으로는 취소된 값만 확인할 수 있다.(어떤 프로미스가 취소되었는지는 알 수 없음)

- Promise.allSettled(promises)

  - Promise.all의 개선된 버전

  - 무조건 전체가 실행되고 전체의 결괏값을 받아볼 수 있고, 거절된 프로미스의 경우도 결괏값에 같이 담아서 온다. 즉, 결괏값으로 프로미스의 상태(status)와 값(value)이 담긴 배열을 받을 수 있다. 이러한 경우 장점은 개발자가 상태에 따라서 로직을 처리할 수 있다는 점이 있다.

- Promise.race(promises)

  - 가장 먼저 처리되는 프로미스의 결괏값만 반환한다. 첫번째로 프로미스가 처리되는 경우, 나머지 프로미스에 대한 처리는 무시된다.

- Promise.resolve(value)

  - Fulfilled 상태의 프로미스를 생성

- Promise.reject(value)
  - Rejected 상태의 프로미스를 생성

그런데 말입니다...🤔 (여기서부터가 나의 궁금증!!!)

`마지막 then`은 꼭 저렇게 적어야할까?!... responses가 배열이기 때문에 배열 안의 promise를 벗겨내기 위한 방법이라서 어쩔수 없다는 생각이 든다. 만약에 map과 같은 배열 메소드를 사용하면 앞서 설명한바와 같이 async/await를 사용할 수 없어서 promise를 벗겨낼 수 없다. 그렇다면, 다른 방법은 없을까?!

#### solution4 : Promise를 잘 사용하자!

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postIds = [1, 2, 5];

(async function fetchPosts() {
  const results = await Promise.allSettled(
    postIds.map((id) =>
      fetch(`${BASE_URL}/${id}`)
        .then((res) => res.json())
        .then((data) => data)
    )
  );
  console.log(results);
})();
```

Promise.allSettled 의 인자로는 promise의 배열(정확히는 이터러블 객체)을 받는다. solution3과 solution4의 차이점은 이 인자로 들어가는 배열에 있다.

```js
// solution3
const promises = postIds.map((id) => fetch(`${BASE_URL}/${id}`));
```

fetch의 반환값은 프로미스이다. promises는 프로미스의 배열이다.

```js
// solution4
const promises = postIds.map((id) =>
  fetch(`${BASE_URL}/${id}`)
    .then((res) => res.json())
    .then((data) => data)
);
```

then의 반환값 역시 프로미스이다. promises 역시 프로미스의 배열이다.

두 코드 모두 반환값은 promise를 가진 배열이다. 그렇기 때문에 allSettled의 인자로 사용해도 전혀 문제가 되지않는다. 그리고 가장 중요한 것은 프로미스라는 것이다. 여기서 나는 프로미스의 정의에 대해서 다시 음미할 수 있었다. 프로미스란 프로미스가 생성된 시점에 비동기 작업의 상태의 성공 혹은 실패에 대한 결괏값을 담은 객체이다. 즉, 위 코드에서는 fetch로 인한 결괏값이 담긴다. 하지만 아직은 이 결괏값이 성공인지 실패인지 알 수 없다. 그리고 solution3처럼 response 객체를 담은 프로미스 객체이든, solution4에서 처럼 최종값을 담은 프로미스 객체이든 관계가 없다. 중요한 것은 비동기작업으로 얻은 (아직은 성공/실패를 알 수 없는) 프로미스 객체라는 것! 그래서 어떻게 인자를 주든 관계가 없었던 것이다. 프로미스에 대한 부족한 경험/지식으로 인해 코드를 정확히 이해하지 못했다.(그래서 코드를 너무 딱딱하게만(?) 바라보게 되었다. 무조건 이렇게 써야한다는 식...😭)

다시 본론으로 돌아오면, solution3에서 복잡하다고 느낀 부분은 프로미스에 대한 이해가 부족했기 때문에 저렇게 적을 수 밖에 없었던 것 같다. 그리고 또 새로운(?) 사실은 solution3에서 Promise.allSettled() 를 2번 사용함으로서 코드를 좀 더 간결하게 만들 수도 있었다.

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const postIds = [1, 2, 5];

(async function fetchPosts() {
  const promises = postIds.map((id) => fetch(`${BASE_URL}/${id}`));
  const results = await Promise.allSettled(promises)
    .then((responses) => responses.map((response) => response.value))
    .then((responses) => Promise.allSettled(responses.map((response) => response.json())))
    .then((posts) => posts.map((p) => p.value));

  console.log(results);
})();
```

즉 프로미스 배열에서는 Promise.allSettled()를 자유롭게 사용할 수 있었다. json()을 통해서 결괏값을 파싱한 프로미스 객체를 전달하고, 그 다음 then에서는 해당값에서 내가 원하는 값을 resolve할 수 있다. 그러면 최종 결괏값은 내가 원하는 값을 가진 프로미스 배열이고 이를 await를 통해서 처리한다.

## 결론

하나의 코드르 4~5가지 방법으로 표현해본 과정을 글로 적으려니 로직과 사고 상의 빠져있는 부분들을 채워넣을 수 있었다. 그럼에도 아직 프로미스에 대한 이해가 완벽하게 되었다고 말하기가 쉽지 않다. 프로미스는 어려운 것 흑흑...😢 (글로 매끄럽게 적는게 쉽지않다는 점도 추가...)

위 글은 여러 개의 비동기 처리를 하는 방법을 코드적인 관점에서만 바라보았다. 하지만 이보다 더 중요한 것은 여러 개의 비동기를 어떤 방식으로 처리할 것인지에 대한 선택이 선행되어야한다고 본다. 여기서 `어떻게`란, `순차처리를 할 것`인지, `병렬 처리를 할 것`인지를 말한다. 비동기 작업이 논리적으로 의존적이여서 순차적으로 처리가 되어야하는 경우라면? 여러 개의 비동기 작업을 최대한 빨리, 순서에 관계없이 처리하여야하는 경우라면? 각각의 상황에 맞게 코드를 구현하는 것이 중요할 것이다. (일반적으로 실무에서는 성능적으로 병렬처리가 더 효율적인 경우가 많을 것 같다. 😅)

## 참고

- [MDN Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise API](https://ko.javascript.info/promise-api)
- [MDN Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [JS: Async/Await in Array Methods](https://medium.com/sliit-foss/js-async-await-in-array-methods-9142a35c6d6f)
- [배열에 비동기 작업을 실시할 때 알아두면 좋은 이야기들](https://velog.io/@hanameee/%EB%B0%B0%EC%97%B4%EC%97%90-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%9E%91%EC%97%85%EC%9D%84-%EC%8B%A4%EC%8B%9C%ED%95%A0-%EB%95%8C-%EC%95%8C%EC%95%84%EB%91%90%EB%A9%B4-%EC%A2%8B%EC%9D%84%EB%B2%95%ED%95%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0%EB%93%A4#for-%EB%AC%B8%EC%9C%BC%EB%A1%9C-%EB%B3%80%EA%B2%BD%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95)
- [반복문을 통한 비동기요청](https://www.youtube.com/watch?v=JawB9nKkCvo&list=PLBQiFVHp3AanopOVdqdfezHnUVDa_JeC5&index=4)
