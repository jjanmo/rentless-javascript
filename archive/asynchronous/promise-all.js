// promise all + async-await
const getMoviesAsync = async () => {
  try {
    const [movie1, movie2] = await Promise.all([
      fetch(
        `https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=48527`
      ),
      fetch(`https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=10`),
    ]).then((responses) => Promise.all(responses.map((r) => r.json())));

    // const [movie1, movie2] = await Promise.all([
    //   movie1Response.json(),
    //   movie2Response.json(),
    // ]);

    console.log(movie1.data, movie2.data);
  } catch (e) {
    console.log(e);
  } finally {
    console.log('getMoviesAsync Done!');
  }
};

getMoviesAsync();

// https://ko.javascript.info/fetch#tasks
const getUsersInfo = async (names) => {
  try {
    const requests = names.map((name) =>
      fetch(`https://api.github.com/users/${name}`)
    );

    const results = await Promise.all(requests);
    const info = await Promise.all(results.map((result) => result.json()));

    console.log('⭕️', info);
  } catch (e) {
    console.log('❌', e);
  } finally {
    console.log('getUsersInfo Done');
  }
};

getUsersInfo(['jjanmo', 'getify', 'lydiahallie']);
