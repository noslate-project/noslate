'use strict';

addEventListener('fetch', function(event) {
  const init = {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  const body = {
    data: 'Hello JSON World!',
  };

  const json = JSON.stringify(body, null, 2);

  const res = new Response(json, init);
  event.respondWith(res);
});
