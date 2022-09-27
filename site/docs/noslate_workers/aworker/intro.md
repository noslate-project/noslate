# Aworker

提供 Web API 标准的 Web-interoperable JavaScript 运行时，适合不直接依赖系统接口的业务逻辑部署。
Aworker 实现了近似 [Service Worker API][] 的规范，提供了基本的 [Request-Response][] 服务 API。

因为提供了相比于 Node.js 的 API 更加高层次、抽象的定义，不会泄漏系统底层状态，Aworker 通过 Startup Snapshot 和 WarmFork 能力，
实现了更快的水平及垂直扩容，能够在毫秒级启动并处理流量，具备更高的弹性效率。

[Service Worker API]: https://www.w3.org/TR/service-workers/
[Request-Response]: https://www.w3.org/TR/service-workers/#fetchevent
