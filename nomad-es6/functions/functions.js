function name1(arg) {} // 함수 선언문

const name2 = function (arg) {}; // 함수 표현식(익명함수)

const names = ['hello', 'world', 'jjanmo'];

/**
 * function make(item){
 *  return item + ' 🌟'
 * }
 *
 * 같은 내용의 arrow function
 * → item => item + ' 🌟'
 *
 * ✅ 주의
 * 함수 바디에 { } 를 사용해야한다면, 명시적으로 return을 사용해야한다.
 */

const stars = names.map((item) => item + ' 🌟'); // arrow function of callback

console.log(stars);
