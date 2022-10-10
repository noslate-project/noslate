# Noslate Debugger 介绍

<div style={{maxWidth: "800px"}} >

![Noslate Debugger](../assets/noslate-db.png)

</div>

## 什么是 Noslate Debugger

Noslate Debugger 是针对 V8 应用的离线分析工具，它可以分析 Node.js 等应用程序产生的 Corefile (Core 文件)，

* 检查 Node.js/V8 应用程序的结构体、堆栈等内容
* 检查 V8 堆内的各种对象信息
* 从 Corefile 中导出 Heap Snapshot
* 业务无感获取 Corefile (通过 Arthur 工具)
* 已支持 Node.js / Alinode / AWorker LTS 官方发行版

### 使用简单

只需要一条命令，就可以在 MacOS / Linux / Windows (通过 WSL) 上分析 Corefile。
```
andb -l -c core.123
```
> `andb` 是 Noslate Deubber 套件中的离线分析工具，基于 `gdb`/`lldb` 插件体系二次开发。

`andb` 会自动下载 Core 产生时匹配的 Node.js 版本并开始调试，可以选择你所熟悉的 `gdb` 或 `lldb` 工具开始调试.

<video controls>
      <source src="/demo_andb.mp4" />
</video>

* 演示加载 Corefile 及自动化匹配版本及调试信息
* 演示 Isolate 结构体的定位和打印
* 演示 V8 Heap Space 和 Page 信息
* 演示 V8 Heap Summary 摘要 和 Inspect 对象
* 演示 Heap Snapshot 导出


## 适应 Serverless

长久以来，Node.js 应用开发都在使用 Inspector 调试代码或堆快照(Heap Snapshot) 定位 OOM 问题，这些本地开发的工具和特性支撑了庞大的应用的开发。

Serverless 应用通常会使用大量生命周期短、规格小的容器，但在此类容器上获得调试诊断能力并不容易，这使得 Serverless 应用长期处于较为黑盒的处境，
* Inspector 需要稳定和实时的网络连接
* Heap Snapshot 需要较多的计算和内存资源

### 基于 Corefile 的 "快照"

不管是 V8 的对象还是堆快照，它都是 "信息" 在内存中的存储，而 Inspector 功能就是可以在 "运行时" 能提取这些信息。   
Noslate Debugger 通过 Corefile 将这部分调试诊断能力转移到了离线时进行，让原有实时性要求高的在线诊断调试转化为只需简单文件上传即可集成使用。

在用户本地或云端服务上提供接近用户本地开发时的调试诊断体感。

<div style={{maxWidth: "700px"}} >

![离线分析](../assets/andb-pic1.png)

</div>

> Corefile (特指 GNU Corefile 格式) 主要记录的是 Node.js 进程的内存和寄存器转储(CoreDump: 内存到磁盘的过程)。    
> 所以它也是进程完整“信息”，被用于 Linux 系统应用 `Crash(有损)` 的调试载体，也可用于 `GCore(无损)` 产生进程快照用于离线分析。   
> Node.js 如果发生 OOM 一般会产生 `core.<pid>` 文件，因为是内存副本较大所以非常占用磁盘空间，频繁的 Crash 就会造成磁盘空间用尽。


### 更小的业务影响

对比原有线上 "堆快照" 对业务的影响长达数分钟，到只影响业务 RT 秒级(通过 `GCore`)，甚至只有几十毫秒(通过 `Arthur`)。

`Corefile` 快照也不会有任何运行时的"添油加醋"，所以它也适合那些还未被GC的对象定位，譬如诊断已经结束了的业务处理等。

> `Arthur` 是 Noslate Debugger 开发的用于低影响获取 `core文件` 的工具，采用 fork 减少进程暂停时间，LZ4 压缩减少转储体积。   
> 通过 fork 子进程提取内存快照而不影响目标业务进程的继续运行，将业务进程 RT 影响进一步减少到毫秒级。   
> 通常一个 `Core文件` 可以被压缩为原尺寸的 20% 左右，视信息是否可压缩，文本的压缩率较大。

带业务流量的线上环境抓取，业务影响 31.106 毫秒，Corefile 大小为 338 MB (进程原使用 1.44GB 物理内存)
```bash
$arthur -p 13481
arthur[14380] I: thread: 13482
arthur[14380] I: thread: 13483
arthur[14380] I: thread: 13484
arthur[14380] I: thread: 13485
arthur[14380] I: thread: 13486
arthur[14380] I: thread: 13487
arthur[14380] I: thread: 13497
arthur[14380] I: thread: 13498
arthur[14380] I: thread: 13499
arthur[14380] I: thread: 13500
arthur[14380] I: remote mmap at 0x7f1e596a33a0
arthur[14380] I: remote fork at 0x7f1e5966fed0
arthur[14380] I: mmap = 0x7f1e5a7ce000
arthur[14380] I: child_pid = 14381
arthur[14380] I: munmap = 0
arthur[14380] W: pread mem(0x7ffe597aa000) failed(5).
arthur[14380] W: pread mem(0xffffffffff600000) failed(22).
arthur[14380] I: waitpid = 14381
arthur[14380] I: Process 13481 paused 31.106 ms.
arthur[14380] I: Compressed 1437173002 bytes into 337922551 bytes ==> 23.51%
```


## 调试信息库

对于传统 C++ 程序来说，只有编译成 Debug 版本的二进制才具有可调试能力查看结构体信息等，原因是编译器在编译时添加了 DebugInfo(调试信息)。   
Debug 很大，`node_g` 动辄 1GB 以上，所以通常官方发布均采用的是 Release 发布。    
Noslate Debugger 建设了一个 Node.js / Alinode/ Aworker 的 LTS 版本的调试信息库，
将额外的调试信息封装在了 `node.typ` 文件并做了合并压缩，使得文件体积在 10MB 左右，
也包括那些已经发布的历史版本。  

`andb` 也是基于该调试信息库提供多版本的离线调试能力，

