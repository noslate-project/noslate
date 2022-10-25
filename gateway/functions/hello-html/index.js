'use strict';

const html = `<!DOCTYPE html>
<html>
  <body>
    <p>Hello HTML World!</p>
  </body>
</html>
`;

addEventListener('fetch', function(event) {
  const init = { status: 200, headers: { 'Content-Type': 'text/html' } };
  const res = new Response(html, init);
  event.respondWith(res);
});
