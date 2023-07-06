# Conditional Spread Operator

## 배경

조건에 따라서 객체를 다른 프로퍼티를 가진 객체를 생성해주고 싶다고 가정해보자! 그러면 아래와 같은 코드를 통해서 객체를 만들어 줄 수 있을 것이다.

```js
const condition = true;

/**
 * 'JUNIOR' || 'SENIOR'
 *  API or 외부에서 받는 조건이라고 가정한다.
 **/
let type = 'JUNIOR';

const base = {
  name: 'jjanmo',
  age: 25,
};

const user = {
  ...base,
  type: condition ? type : null,
};

console.log(user);
```

콘솔에는 조건에 따라서 `{ name: 'jjanmo', age: 25, type: 'JUNIOR' }` 나 `{ name: 'jjanmo', age: 25, type: null }` 인 값으로 출력이 될 것이다.
특별하게 문제가 없어 보일 수 있다. 그런데 condtion이 false 인 경우에 굳이 `type: null` 이라는 프로퍼티가 존재해야만 할까?
false인 경우엔 프로퍼티가 없게는 만들지 못할까? 이걸 구현할 수 있게 해주는 것이 `Conditional Spread` 이다.

```js
const condition = true;

let type = 'JUNIOR';

const base = {
  name: 'jjanmo',
  age: 25,
};

const user = {
  ...base,
  ...(condition && { type }), // ✅
};

console.log(user);
```

콘솔에는 `{ name: 'jjanmo', age: 25, type: 'JUNIOR' }` 나 `{ name: 'jjanmo', age: 25 }` 이 노출되는 것을 확인 할 수 있었다. 코드 자체가 심플하며,

## 그런데 말입니다. 왜죠??

내부 동작이 어떻게 되죠?? true 인 경우엔 이해가 되는데 false 인 경우엔??

https://www.amitmerchant.com/conditionally-spreading-objects-in-javascript/
-> 요런 이유때문에 그렇다는데??

바벨로 변환시켜봄!!

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object/40560953?answertab=modifieddesc#tab-top

spread operator가 어떻게 동작하길래 저런 결과가 나오는거지??
