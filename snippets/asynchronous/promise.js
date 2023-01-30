/**
 * promise 정의s (정의 중 와닿는 말들)
 * 1. A promise is an object that may produce a single value some time in the future
 * 2. 내용은 실행되었지만 아직 결과를 반환하지 않은 객체 → 내가 원할때, 프로미스 객체를 통해서 값을 반환하여 조작할 수 있다
 */

// ex1) promise를 통한   코드의 분리
const notYet = new Promise((resolve, reject) => {
  resolve('hello world');
});

const otherLogics = () => [1, 2, 3, 4].map((number) => number + 2);
const result = otherLogics();
console.log(result);

notYet.then((res) => console.log(res));

//ex2 같은 비동기 코드에서의 순서? micro queue / macro queue → 우선순위 micro > macro
// macro queue : Promise, process.nextTick()(node)
// → 아래 코드 처럼 거의 동사에 queue에 비동기코드가 쌓이게 된다면, micro queue에 쌓인 것을 먼저 실행한다.
// 참고 https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

setTimeout(() => {
  console.log(1);
}, 1000);
setTimeout(() => {
  console.log(2);
}, 2000);
Promise.resolve().then(() => console.log(3));
