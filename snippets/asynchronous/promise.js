/**
 * promise 정의s
 * 1. A promise is an object that may produce a single value some time in the future
 * 2. 내용은 실행되었지만 아직 결과를 반환하지 않은 객체 → 내가 원할때, 프로미스 객체를 통해서 값을 반환하여 조작할 수 있다
 * ----------
 * by 제로초
 * - 한 번 비동기는 영원한 비동기
 * - 비동기는 동시의 문제가 아니라 순서의 문제
 */

// ex1) promise를 통한   코드의 분리
// const notYet = new Promise((resolve, reject) => {
//   resolve('hello world');
// });

// const otherLogics = () => [1, 2, 3, 4].map((number) => number + 2);
// const result = otherLogics();
// console.log(result);

// notYet.then((res) => console.log(res));

//ex2 같은 비동기 코드에서의 순서? micro queue / macro queue → 우선순위 micro > macro
// macro queue : Promise, process.nextTick()(node) / 그외 비동기는 micro queue
// → 아래 코드 처럼 거의 동사에 queue에 비동기코드가 쌓이게 된다면, micro queue에 쌓인 것을 먼저 실행한다.
// 참고 https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

// output : 3 → 1 / 2 or  3 →  2 / 1
// setImmediate vs setTimeout → 😡 이 둘은 구분할 필요 없다.! 기본적으로 성능에 의해 달라짐, 비동기간에 순서를 만드는일을 없애자!

// setImmediate(() => {
//   // macro
//   console.log(1);
// });
// setTimeout(() => {
//   // macro
//   console.log(2);
// }, 0);

// Promise.resolve().then(() => console.log(3)); // micro

//ex3 비동기 변환 (+ 분석)
// 1. new Promise 안의 함수는 동기적 실행
// 2. then은 resolve가 호출될때 실행된다.

// output
// 2 → 3 → 1 → 4

let number = 10;
setTimeout(() => {
  number += 10;
  console.log('1', number);
}, 0);

console.log('2', number);

const promise = new Promise((resolve, reject) => {
  console.log('3', number);
  setTimeout(() => {
    number += 10;
    resolve(number);
  }, 0);
});

promise.then((res) => console.log('4', res));
