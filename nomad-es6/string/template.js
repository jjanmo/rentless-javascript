const $wrapper = document.querySelector('.wrapper');

// 1)
const addGreeting = () => {
  const $container = document.createElement('div');
  $container.className = 'container';
  const $title = document.createElement('h1');
  $title.className = 'title';
  $title.textContent = 'Hello World JJanmo 🚀';
  $container.append($title);
  $wrapper.append($container);
};

const addGreetingByTemplate = () => {
  $wrapper.innerHTML = `
    <div class="container">
      <h1 class="title">Hello World JJanmo 🚀</h1>
    </div>
  `;
};
// → 같은 코드를 훨~~씬 가독성 있게 만들수 있다!

// setTimeout(addGreeting, 2000);
setTimeout(addGreetingByTemplate, 2000);

// 2)
const heros = ['ironman', 'batman', 'superman', 'captain america'];

const addHeros = () => {
  $wrapper.innerHTML = `
    <ul>
      ${heros.map((hero) => `<li>${hero} 🚀</li>`).join('')}
    </ul>
  
  `;
};

setTimeout(addHeros, 5000);
