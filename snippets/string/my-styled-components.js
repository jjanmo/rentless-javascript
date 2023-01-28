/*
template literal이 좀 더 발전된 형태 → tagged templates
tag를 사용하면 template literal을 함수로 파싱할 수 있습니다.

즉 tag를 통해서 특정 함수를 호출하면, 각각의 인자로서 문자열부분과 표현식부분(변수로 사용한 부분)을 구분할 수 있다.

example
const tagged = (styles, expression) => console.log(styles, expression)
tagged`background : red; font-size : ${({big}) => big && '30px'}}`
→ 콘솔 : ['background : red; font-size : ', '}', raw: Array(2)], ({big}) => big && '30px'
*/

const domElements = ['div', 'h1']; // 아래에서 사용하는 부분만 적음
const $wrapper = document.querySelector('.wrapper');

const styled = (element) => {
  return (styles) => {
    const target = document.createElement(element);
    target.style = styles;

    target.textContent = 'hello world'; // vjs이기때문에 필요

    return target;
  };
};

// 아래 코드는 리액트에서처럼 styled.div 로 접근가능하게 해준다.(실제 styled-components에서와 동일)
domElements.forEach((domElement) => {
  styled[domElement] = styled(domElement);
});

const result = styled.div`
  color: red;
  font-size: 3rem;
  text-transform: uppercase;
`;

const result2 = styled.h1`
  background-color: aquamarine;
  color: black;
`;

$wrapper.append(result);
$wrapper.append(result2);

// 사실 위는 실제 styled-components의 동작을 기본적인 개념을 토대로 모사한것이지 실제와 같진않다. 자세하고 정확한 내부 동작은 아래를 참고
// 참고 링크
// → https://john015.netlify.app/styled-components%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%A0%EA%B9%8C
