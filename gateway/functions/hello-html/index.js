'use strict';

const html = `<!DOCTYPE html>
<html>
  <body>
    <p>Hello HTML World!</p>
  </body>
</html>
`

addEventListener('fetch', function(event) {
  var init = { "status" : 200 , "headers": {"Content-Type": "text/html"}};
  var res = new Response(html,init);
  event.respondWith(res);
});