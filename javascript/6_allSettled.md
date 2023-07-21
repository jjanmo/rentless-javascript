# Promise.allSettled 에 대한 이해

## 배경

여러 개의 데이터를 fetch를 통해서 받아오기 위해서 다양한 방법들이 있을 수 있다. 그 중에서 `Promise.allSettle()` 메소드를 사용하여 데이터를 받는 과정에서 최종 데이터 값을 제대로 받아올 수 없었다. 중간에 자꾸 최종 결과값이 아닌 Promise를 가진 배열을 받아오게 되는 것이였다. 왜 타입이 저렇게 되는거지를 궁금해하면서 Promise에 대해서 좀 더 알아보는 기회가 되었다. 이 과정에서 여러가지 방법들을 구현해본 결과를 정리해보고자 한다.

## Solutions

- 아래는 1번의 fetch를 사용하여 데이터를 받는 코드이다.

  ```js
  const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

  async function fetchPost() {
    const response = await fetch(`${BASE_URL}/2`);
    const result = await response.json();
    console.log(result); // ?
  }

  fetchPost();
  ```

  위 코드로 받아오는 데이터는 아래와 같다.

  ```js
    {
      userId: 1,
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae\n' +
        'sequi sint nihil reprehenderit dolor beatae ea dolores neque\n' +
        'fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\n' +
        'qui aperiam non debitis possimus qui neque nisi nulla'
    }
  ```

- 그렇다면 여러 번의 통신을 통해서 여러 개의 데이터를 받기 위해서는 어떻게 해야할까?

  보통 반복문을 통해서 여러 번의 fetch를 통해서 값을 받아오는 방법을 생각할 것이다.

```js
async function fetchPosts() {
  const promises = postIds.map((id) => fetch(`${BASE_URL}/${id}`));
  const results = await Promise.allSettled(promises).then((responses) =>
    responses.map((res) => res.value.json())
  );

  console.log(results);
}

fetchPosts();
```

위 코드의 results 값은 프로미스 객체가 담긴
