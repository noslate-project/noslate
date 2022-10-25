'use strict';

const destinationURL = 'https://noslate.midwayjs.org/';

const statusCode = 301;

async function handleRequest() {
  return Response.redirect(destinationURL, statusCode);
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request));
});
