# Noslate Project Overview

Noslate is an exploration of the evolution of the Node.js/V8 technology stack in the cloud-native era, aiming to improve the scheduling performance and diagnosing black-box problems of JavaScript in cloud-native scenarios. The goal is to allow JavaScript Workload to have higher scheduling flexibility in the cloud-native era. At present, the relevant software has been applied in some core scenarios of online services links. This project mainly consists of three sub-projects: Workers, Debugger, and Node.js Distribution.

Driven by the concepts of cloud native/Serverless, we will start to think about what are the differentiating features of JavaScript Workload when it emphasizes scheduled (or elastic) performance? We started to optimize Node.js user code loading (cold start of function computing), and later made a Workers sub-project for lightweight end-cloud isomorphic Workload. Later, we found that after the elastic efficiency was higher, exceptions and crashes became difficult to locate, and then developed a Debugger sub-project. At the same time, relying on some basic directions of The Alibaba Cloud OpenAnolis community, we can carry out some basic technical evolutions.

This project is mainly composed of three parts: Workers, Debugger, and Node.js Distribution. The following is a preliminary introduction.

### 一、Noslate Workers

<div style={{maxWidth: "800px"}} >

![Noslate Workers](../assets/noslate-workers.png)

</div>

The Web standard lightweight runtime that conforms to the W3C Web-interoperable specification provides a complete set of upper-level management and control software to form a complete solution. Software highlights are provided by Warmfork and Snapshot features - efficient single-machine or distributed task distribution extensions with business startup status.


[Learn more about Workers](/docs/noslate_workers/intro)

### 二、Noslate Debugger

<div style={{maxWidth: "800px"}} >

![Noslate Debugger](../assets/noslate-db.png)

</div>

Offline Corefile debugging tool for Node.js/V8, provides V8 heap memory check, Heap Snapshot diagnostic file export, Backtrace and other special debugging functions, and is equipped with a high-performance running corefile acquisition and compression tool.

[Learn more about Debugger](/docs/debugger/intro)

### 三、Noslate Node.js Distribution

<div style={{maxWidth: "800px"}} >

![Noslate Node.js Distribution](../assets/noslate-an.png)

</div>

Optimized for elastic scenarios, which improves the loading speed of user code and improves cold start efficiency, mainly including Require relationship acceleration and Bytecode Cache. It also includes performance optimization features for the ARM architecture from the Alibaba Cloud basic software team.

[Learn more about Node.js Distribution](/docs/node_js/intro)
