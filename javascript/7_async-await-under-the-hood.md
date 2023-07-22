# Async Await는 왜 이렇게 동작하는걸까?

## 배경

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

그렇다면 await가 없다면 어떤 값이 노출될까? 결과적으로 에러가 나타난다. 그 이유는 fetch로 받은 리턴값(response)이 await가 있을 때와는 다르게 `Promise<Response>`이기 때문이다. 그래서 response는 프로미스 객체이기에, json() 이라는 메소드가 없기때문에 에러가 난다. 즉, await가 없는 경우에는 프로미스 객체를 리턴하게 되는 것을 알게 되었다. 또 json() 메소드 역시 프로미스 객체를 리턴하는 메소드인데 await가 있는 코드(정상작동하는 코드)에서 result는 결과값을 확인할 수 있었다.

나는 도대체 await가 내부적으로 무슨 일을 하길래 프로미스 객체를 우리가 벗겨주는(?) 것인지 궁금해졌다. 그래서 async/await의 내부 구조에 대해서 살펴보고자한다.

##

https://dev.to/gafi/7-reasons-to-always-use-async-await-over-plain-promises-tutorial-4ej9

https://medium.com/siliconwat/how-javascript-async-await-works-3cab4b7d21da
