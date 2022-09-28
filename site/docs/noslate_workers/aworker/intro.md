# Aworker 介绍

提供 Web API 标准的 Web-interoperable JavaScript 运行时，适合不直接依赖系统接口的业务逻辑部署。
Aworker 实现了近似 [Service Worker API][] 的规范，提供了基本的 [Request-Response][] 服务 API。

因为提供了相比于 Node.js 的 API 更加高层次、抽象的定义，不会泄漏系统底层状态，Aworker 通过 Startup Snapshot 和 WarmFork 能力，
实现了更快的水平及垂直扩容，能够在毫秒级启动并处理流量，具备更高的弹性效率。

## Warmfork

大家都知道 fork(2) 系统调用有几个优势：
1. 新进程可以继承母进程的当前状态，而无需从 main() 开始初始化；
2. pcb、栈、内存页，页表都是纯内存复制，所以进程创建快 (<1ms)；
3. CopyOnWrite，新进程可以继承母进程的静态页表，可节省系统内存；

对于 Node.js 来说，因为其无法在主线程持有所有多线程的状态 (如锁，信号量等)，所以 Node.js 进行 fork 的修改难度很大。其多线程设计主要
来源于 libuv 库和 V8 Platform Worker 线程：
- 因部分 IO 操作存在同步调用，如 dns，文件读写等，所以 libuv 使用 IO 线程将同步操作转换成异步操作；
- Node.js 的 V8 默认配置为多线程 GC、Background Compilation/Optimization 的方式。

Node.js 的单进程多线程模型可以由下图表示：

![thread-model-1](/img/noslate/references/thread-model-1.png)

Aworker 的设计是采用单进程单线程的模型，也就是将上述模型中的 worker thread 单独抽出放到一独立进程中。Worker 因此可支持
fork，从而避免从 main() 开始的启动消耗，达到快速启动的目的。

![thread-model-2](/img/noslate/references/thread-model-2.png)

为了支持单线程，Aworker 还做了如下修改：
- 使用了 Linux AIO 特性替掉了 libuv 中同步的文件系统操作（不是 POSIX AIO，两者有区别。Posix AIO 类似于 libuv
  现有的实现）；
- 使用 V8 的 SingleThread 模式，这是一个给 Low-end devices 实现的能力，不过非常符合 Serverless 资源模型；

而为了管理、隔离这些 Worker Process，我们需要一个轻量的业务进程容器管理组件 Turf ，该组件用于能通过 WarmFork 方式创建新的
Aworker 服务进程，并能提供一定的资源、环境的隔离能力，同时兼容 OCI。区别于传统 runc, rund 的容器，turf 旨在承载如 Aworker
这类轻 JS Runtime，它无需镜像运行，开销更低，可以支持更高的部署密度。

Alinode WarmFork 具体的对比：

![turf-warmfork-comparison](/img/noslate/references/turf-warmfork-comparison.png)

提供 "被复制" 的进程，称为 "种子进程"，其他服务进程都是该进程的克隆。譬如 Alinode Worker 作为种子进程，它需要确定自己一个 "可被克隆"
的时间点，将自己的所在状态（内存）作为克隆进程的初始状态。

WarmFork 的系统时序如下：

![turf-warmfork](/img/noslate/references/turf-warmfork.png)

## Startup Snapshot

WarmFork 能解决了单机上服务进程的快速启动，对于冷机启动需要采用 Startup Snapshot 方案。Startup Snapshot 和
CodeCache 的区别在于 Startup Snapshot 能够保存用户代码逻辑执行状态，而 CodeCache 只保存代码解析结果、仍然需要重新执行
用户代码逻辑。

设计上，Startup Snapshot 可提供携带用户代码逻辑的快速恢复，但是也有局限性：
1. Startup Snapshot 对内存开销敏感，如果应用启动阶段用了大量内存，可能造成负优化；
2. 用户代码启动需要没有歧义的状态，比如 IP 地址、日期、连接状态、服务发现结果等，针对这些歧义内容用户代码需要在进程恢复时有修正能力；

V8 的 Startup Snapshot Serializer 就是一个类似于 GC 的对象遍历器。这个遍历器通过遍历加入到 Snapshot 中的
Root 对象，遍历它所对应的对象图并按照对象关系生成一系列的反序列化指令。

Startup Snapshot 相当于从 V8 Context 对象与它的 `globalThis` 开始，遍历堆中所有的对象并将对象关系与引用序列化成
特有的字节码，形成一个线性的可存储状态。并在恢复时，解释执行这些字节码，恢复堆中的对象内容与他们之间的引用关系。

![v8-serializer](/img/noslate/references/v8-serializer.png)

对于运行时 Built-in 的 Startup Snapshot，Blink 与 Node.js 等都有非常显著的加速效果：
- Blink 最终能有 1.5-3 倍的优化效果；
- Node.js 最终有 2-5 倍的优化效果（100ms→20ms）；

[Service Worker API]: https://www.w3.org/TR/service-workers/
[Request-Response]: https://www.w3.org/TR/service-workers/#fetchevent
