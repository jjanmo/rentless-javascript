// 1) this in event handler
const $button = document.querySelector('.button');

function handleClick() {
  console.log(this); // $button element(이벤트 리스너가 달린 요소)
}

const handleClickArrow = () => {
  console.log(this); // window
};

// $button.addEventListener('click', handleClick);
$button.addEventListener('click', handleClickArrow);

/*
this는 함수가 호출될 때 해당 값이 결정된다.
이벤트 핸들러 = callback → 콜백함수에서의 this는 항상 window 이다.(in browser, 제어권이 브라우저에 있기 때문에)
그런데 이벤트 핸들러에서는 예외적으로 this를 사용하면 이벤트 리스너의 요소(이벤트 리스너가 달린 요소)를 가르키게 된다. 그래서 위의 예사와 같이 콘솔이 출력된다.

반면 화살표함수의 경우엔 화살표함수가 호출될 때, 해당 함수내에서는 this가 존재하지 않기 때문에 상위 스코프에서의 this를 가져와서 사용하게된다.
그래서 이벤트 핸들러에서 화살표함수를 사용하게되면 위에서 말한 예외적인 규칙을 무시하고 화살표함수만의 규칙을 따르게 되어 상위 스코프인 window가 콘솔에 출력되는 것이다.
*/

// 2) this in method of object

const jjanmo = {
  name: 'jjanmo',
  age: 25,
  addAge: () => {
    this.age++;
  },
};

console.log(jjanmo.age);
jjanmo.addAge();
jjanmo.addAge();
console.log(jjanmo.age); // 예상값 : 27 | 결과값 : 25 ??

/*
addAge안에서 this는 jjanmo. ~~ 로 호출되기때문에 this는 jjanmo가 되어야한다고 생각할 수 있다.
하지만 이 때는 함수가 화살표함수이기 때문에 함수가 호출될 때의 상위 스코프에서의 this를 가져와서 사용한다.
그래서 결국 window.age++로서 작동하고 이값은 NaN이 될 것이고, jjanmo.age와는 상관이 없기때문에 그대로 25가 콘솔에 출력되는 것이다.

이 함수를 우리가 원하는 값을 계산하도록 수정하는 방법은 단순히 화살표함수가 아닌 일반 함수로서 이를 작성하면 된다.
그러면 자연스럽게 this는 호출할때 . 앞의 객체인 jjanmo를 의미하게 된다. ( → jjanmo.age)

addAge() {
  this.age++;
}
*/

// default value

const DEFAULT = 'anonymous';

const greeting = (name = DEFAULT) => `Hello World ${name}`;

console.log(greeting());
console.log(greeting('jjanmo'));
