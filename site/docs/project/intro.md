# Noslate 项目整体介绍

Noslate 是我们以 Node.js/V8 技术栈在云原生时代演进的一次探索，旨在提高云原生场景下 JavaScript 的被调度性能和诊断性黑盒问题。目标让 JavaScript 的 Workload 在云原生时代拥有更高的调度灵活性。目前相关软件已经在某些在线链路的核心场景应用，本项目主要由 Workers、Debugger、Node.js Distribution 三个子项目组成。

在云原生/Serverless 这些理念的牵引下，我们会开始思考 JavaScript 的 Workload 在更强调被调度（或弹性）性能的时期，差异化的特点是什么？我们一开始进行了 Node.js 用户代码加载（函数计算冷启动）的优化，后来又面向轻量端云同构 Workload 做了 Workers 子项目，再后来我们发现弹性效率高了之后异常和崩溃变得难以定位，进而研发了 Debugger 子项目。同时依托阿里云龙蜥社区一些偏基础的方向，我们得以可以进行一些偏基础的技术演进。

本项目主要由 Workers、Debugger、Node.js Distribution 三个部分组成，下面是初步的介绍。

### 一、Noslate Workers

<div style={{maxWidth: "800px"}} >

![Noslate Workers](../assets/noslate-workers.png)

</div>


符合 W3C Web-interoperable 规范的 Web 标准轻量运行时，配套提供整体的上位管控软件，形成完整解决方案。软件亮点有 Warmfork 和 Snapshot 特性来提供 —— 高效的带业务启动状态的单机或分布式任务分发扩展。

[详细了解](/docs/noslate_workers/intro)

### 二、Noslate Debugger

<div style={{maxWidth: "800px"}} >

![Noslate Debugger](../assets/noslate-db.png)

</div>

面向 Node.js/V8 的离线 Corefile 调试工具，提供 V8 堆内存检查、Heap Snapshot 诊断文件导出、Backtrace 等特色调试功能，并配套一个高性能的运行态 Corefile 获取和压缩工具。

[详细了解](/docs/debugger/intro)

### 三、Noslate Node.js Distribution

<div style={{maxWidth: "800px"}} >

![Noslate Node.js Distribution](../assets/noslate-an.png)

</div>

面向弹性场景进行优化，提高了用户代码的加载速度提高冷启动效率，主要包括 Require 关系加速、Bytecode Cache。同时还包含来自阿里云基础软件团队面向 ARM 架构的性能优化特性。

[详细了解](/docs/node_js/intro)
