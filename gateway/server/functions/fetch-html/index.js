'use strict'

const url = 'http://noslate.midwayjs.org/docs/intro';

async function handleRequest() {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };
  const response = await fetch(url, init);
  const text = await response.text();
  return new Response(results, init);

}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest());
});
