# Noslate 项目整体介绍

Noslate 是阿里巴巴集团在 Node.js/V8 领域研发产出的综合项目，由大淘宝技术部和阿里云基础软件部共同发起。主要意在提高云原生场景下 JavaScript 的调度性性能和诊断性黑盒问题。目标让 JavaScript 任务在云原生时代拥有更高的调度灵活性，进而满足泛终端、全栈等领域的交付和托管需求。目前相关软件已经在阿里集团内部关键场景应用，亦在阿里云部分公有云产品中采用。

主要由 Workers、Debugger、Node.js Distribution 三个部分组成，下面是初步的介绍。

### 一、Noslate Workers

<div style={{maxWidth: "800px"}} >

![Noslate Workers](../assets/noslate-workers.png)

</div>


自研符合 W3C WinterCG 规范的 Web 标准轻量运行时，配套提供整体的上位管控软件，形成完整解决方案。软件亮点有 Warmfork 和 Snapshot 特性来提供 —— 高效的带业务启动状态的单机或分布式任务分发扩展。

[详细了解...](../noslate_workers/intro)

### 二、Noslate Debugger

<div style={{maxWidth: "800px"}} >

![Noslate Debugger](../assets/noslate-db.png)

</div>

面向 Node.js/V8 的离线 Corefile 调试工具，提供 V8 堆内存检查、Heap Snapshot 诊断文件导出、Backtrace 等特色调试功能，并配套一个高性能的运行态 Corefile 获取和压缩工具。

[详细了解...](../debugger/intro)

### 三、Noslate Node.js Distribution

<div style={{maxWidth: "800px"}} >

![Noslate Node.js Distribution](../assets/noslate-an.png)

</div>

面向弹性场景进行优化，提高了用户代码的加载速度提高冷启动效率，主要包括 Require 关系加速、Bytecode Cache。同时包含来自阿里云基础软件团队的 ARM 架构的性能优化特性。

[详细了解...](../node_js/intro)
