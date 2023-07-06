# Javascript Tricks Part1

> 좀 더 깔끔한 자바스크립트 코드를 작성하기 위한 몇가지 트릭들 소개

https://javascript.plainenglish.io/8-javascript-tricks-to-make-you-a-better-programmer-948b5a3c35b4

https://medium.com/dhiwise/11-useful-modern-javascript-tips-9736962ed2cd

## Destructuring

### Rename

```js
// API로 받아올 데이터
const data = {
  common: {
    has_alarm: true,
    schedules: [{ course_id: 2002, title: '스토리로 표현하기' }],
  },
};

let hasAlarm = false;

console.log(hasAlarm); // false

// call API and update variable

const {
  common: { has_alarm: hasAlarm },
} = data; // API를 통해서 받아온 값

console.log(hasAlarm); // error
```

> 같은 이름의 변수인 assignments가 2번 사용되어서 에러가 발생!

> Error Log : `Uncaught SyntaxError: Identifier 'hasAlarm' has already been declared`

에러가 발생하지 않도록 하기 위해선 destructuring 부분을 아래와 같은 코드를 변경하면 된다.

```js
({
  common: { has_alarm: hasAlarm },
} = data);
```

> 변수를 생성하지 않고 기존 변수에 값을 업데이트 하게 된다.

### Swap

```js
let favHero = 'pizza';
let favFood = 'captain america';

[favHero, favFood] = [favFood, favHero];

console.log(favHero, favFood); // captain america, pizza
```

> destructuring를 이용해서 아주 쉽게 두 개의 변수를 스왑하는 방법이다.

```js
let favHero = 'pizza';
let favFood = 'captain america';

const tmp = favHero;
favHero = favFood;
favFood = tmp;

console.log(favHero, favFood); // captain america, pizza
```

> 위 코드는 가장 전통적인(?) 스왑 방법이다. 일반적으로 다른 언어(destructuring 문법이 없는 언어)에서는 이런 식으로 많이 사용한다.

## Spread

### Clean Object

객체에서 두가지를 하려고 한다. 1) 특정 속성의 키값을 변경한다. 2) 특정 속성값을 삭제한다. 방법은 여러가지가 있을 수 있겠지만, spread를 사용하는 방법으로 구현해보겠다.

- General Code

  ```js
  const user = {
    name: 'jjanmo',
    AGE: 24,
    gender: 'male',
    country: 'korea',
  };

  const cleanUser = (user) => {
    user['age'] = user.AGE;
    delete user['country'];
    delete user['AGE'];
  };

  cleanUser(user);

  console.log(user);
  ```

  > 일반적으로 위 코드처럼 속성값에 제거하고 수정하곤 한다. mutable한 방법이다.

- Better Code

  ```js
  const user = {
    name: 'jjanmo',
    AGE: 24,
    gender: 'male',
    country: 'korea',
  };

  const cleanUser = ({ AGE: age, country, ...rest }) => ({
    ...rest,
    age,
  });

  const cleaned = cleanUser(user);

  console.log(cleaned); // { name: 'jjanmo', gender: 'male', age: 24 }
  ```

  > destructuring과 rest 연산자와 함께하면 위와 같이 아예 속성값을 삭제하거나 변경할 수 있다. immutable한 방법이다.
