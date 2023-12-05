# Async Await는 왜 이렇게 동작하는걸까?

## 배경

> 궁금증을 갖게 된 배경?

### 첫번째

```js
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

(async function fetchPost() {
  const response = await fetch(`${BASE_URL}/2`);
  const result = await response.json();
  console.log(response, result); // ?
})();
```

위 코드를 보고 response와 result는 어떤 값이 나올지 예상할 수 있을까?

- response : fetch를 통해서 받아온 Response 타입의 데이터
- result : 최종적으로 우리가 얻고자하는 데이터로, Response 객체의 본문을 JSON으로 파싱한 결과값

> 아래 이미지 참고

![output](/screenshots/7-1.png)

### 두번째

fetch나 response.json()앞에 await가 없다면??

- fetch() 앞 await 제거

  결과적으로 `TypeError: response.json is not a function` 라는 에러가 발생한다. 그 이유는 response의 값이 프로미스 객체(`Promise<Response>`) 이기 때문이다. 즉 프로미스 객체에는 json()이라는 메소드가 없어서 위와 같은 에러가 발생한다.

- response.json() 제거

  에러는 나지 않지만, 역시나 result의 값이 프로미스 객체가 된다.

fetch()나 json() 메소드에 대한 타이핑을 찾아보면 모두 프로미스 객체를 리턴하는 것으로 나온다. 그런데 위 결과를 await을 붙이게되면 그 프로미스 객체를 벗겨지면서 우리가 원하는 값을 얻을 수 있는 상태가 된다. await 라는 키워드가 도대체 어떤 작동을 하는 것일까?

### 세번째

await을 사용하면 마치(?) 동기적으로 작동한다. 비동기적인 fetch 함수에 대한 값을 기달렸다가 해당 값을 받고 다음으로 넘어가게 된다. 어떻게 await 하나만으로 이런 식의 코드 흐름을 가질수 있을까?

이러한 궁금증에서 부터 시작하여 async-await가 도대체 어떻게 생겨먹은 것인지 알아보고자 한다.

## async-await의 내부구현

https://medium.com/siliconwat/how-javascript-async-await-works-3cab4b7d21da

https://yeoulcoding.me/213

https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Introducing

## 메모리적인 관점에서의 async-await의 동작
