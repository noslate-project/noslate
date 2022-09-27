# Warmfork

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
