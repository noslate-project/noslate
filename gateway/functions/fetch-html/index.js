'use strict';

const url = 'https://noslate.midwayjs.org/';

async function handleRequest() {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };
  const response = await fetch(url, init);
  const text = await response.text();
  return new Response(text, init);

}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest());
});
