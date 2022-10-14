# Web API

Aworker implements a specification similar to [Service Worker API][], providing a basic [Request-Response][] service API.

```js
addEventListener('fetch', event => {
  event.respondWith(new Response('hello world'));
});
```
Aworker provides common Web APIs defined in ServiceWorkerGlobalScope, WorkerGlobalScope or WindowOrWorkerGlobalScope. Typically, this includes the following web APIs:

- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
- [Console](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
- [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
- [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL_API)

## Aworker lifecycle

Aworker will have the following events from loading user code initialization to starting to receive requests:

- `'install'`: The first event received after the user code is fully loaded. The program can start loading the cache in this event.
- `'activate'`: Represents that Aworker is ready to receive requests.
- `'fetch'`: Represents a request event.

There will be no events until the Worker instance is destroyed. It is usually guaranteed by the runtime that the Worker instance will be recycled after all requests have been responded to.

Aworker's events can be monitored through the Web EventTarget API, such as:

```js
addEventListener('install', event => {
  // initializing cache...
});
```

### Event: `'install'`
MDN: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event

Parameters: 
- event <[ExtendableEvent][]>

The first event received after the user code is fully loaded

```js
addEventListner('install', event => {
  event.waitUntil(Promise.all([
    cacheReady('http://example.com'),
  ]));
});
```

### Event: `'activate'`
MDN: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event

Parameters: 
- event <[ExtendableEvent][]>

Represents that the Worker instance is ready to receive requests.

```js
addEventListner('activate', event => {
  event.waitUntil(asyncOperation());
});
```

### Event: `'fetch'`

Parameters: 
- event <[FetchEvent][]>

Represents a request event.

```js
addEventListener('fetch', event => {
  event.respondWith(new Response('hello world'));
});
```

[ExtendableEvent]: https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
[FetchEvent]: https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
[Service Worker API]: https://www.w3.org/TR/service-workers/
[Request-Response]: https://www.w3.org/TR/service-workers/#fetchevent
