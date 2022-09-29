# Web API

Aworker 实现了近似 [Service Worker API][] 的规范，提供了基本的 [Request-Response][] 服务 API。

```js
addEventListener('fetch', event => {
  event.respondWith(new Response('hello world'));
});
```

Aworker 提供了常见的定义在 ServiceWorkerGlobalScope，WorkerGlobalScope 或者 WindowOrWorkerGlobalScope 中的 Web API。通常，这包括以下 Web API：

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

## Worker 生命周期

Worker 环境从加载用户代码初始化到开始接收请求会有以下几个事件：

- `'install'`: 用户代码完全加载完成后，第一个接收到的事件。程序可以开始在这个事件里加载缓存。
- `'activate'`: 表示 Worker 已经开始准备接收请求。
- `'fetch'`: 表示请求事件。

Worker 实例被销毁前不会有事件。通常会由运行时保证在所有请求响应完毕后，Worker 实例才被回收。

监听 Worker 的事件可以通过 Web EventTarget API，比如：

```js
addEventListener('install', event => {
  // initializing cache...
});
```

### Event: `'install'`
MDN: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event

参数：
- event <[ExtendableEvent][]>

用户代码完全加载完成后，第一个接收到的事件

```js
addEventListner('install', event => {
  event.waitUntil(Promise.all([
    cacheReady('http://example.com'),
  ]));
});
```

### Event: `'activate'`
MDN: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event

参数：
- event <[ExtendableEvent][]>

表示 Worker 实例已经开始准备接收请求。

```js
addEventListner('activate', event => {
  event.waitUntil(asyncOperation());
});
```

### Event: `'fetch'`

参数：
- event <[FetchEvent][]>

表示请求事件。

```js
addEventListener('fetch', event => {
  event.respondWith(new Response('hello world'));
});
```

[ExtendableEvent]: https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent
[FetchEvent]: https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
[Service Worker API]: https://www.w3.org/TR/service-workers/
[Request-Response]: https://www.w3.org/TR/service-workers/#fetchevent
