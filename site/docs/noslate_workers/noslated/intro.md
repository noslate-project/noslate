# Alice

Noslate Container Deamon，作为 Noslate Serverless 解决方案的核心，提供了 Serverless 需要的容器调度、弹性扩容、配置管理、流量管理等能力。

它由两个角色组成：
1. 控制面板（Control Panel）
2. 数据面板（Data Panel）

![Alice 结构](https://gw.alicdn.com/imgextra/i1/O1CN01fgxsGq1Spc9EfS89S_!!6000000002296-0-tps-11854-5629.jpg)

## 控制面板（Control Panel）
作为 Alice 的大脑，负责保障整个系统的正常运行，它整合当前系统的运行指标，评估当前水位，并根据[既定策略](noslate_workers/references/scale.md)实现容器数量的动态调配。

### 配置管理
函数的元信息和服务路由配置均由 Control Panel 管理，并分发给 Data Panel 使用。当收的配置更新时，会和已有配置做对比，更新函数代码包及对应容器。

在 Alice 系统中存在三种配置：
1. [函数配置](noslate_workers/references/function_profile)
2. [服务路由配置](noslate_workers/references/service_profile)
3. [系统配置](noslate_workers/references/system_config)

以更新函数配置为例：
![函数配置](https://gw.alicdn.com/imgextra/i2/O1CN01N9rKb01Xb1c2tc91V_!!6000000002941-0-tps-5766-2779.jpg)

## 数据面板（Data Panel）
Data Panel 是 Alice 的请求主链路，所有流量均通过 Data Panel 流经对应的 Worker，在得到函数调用指令后，决定将数据发送给哪个容器。

另外，容器对外的请求（BaaS 服务）均是由 Data Panel 作为代理执行。

## 基础交互流程
![基础交互流程](https://gw.alicdn.com/imgextra/i2/O1CN01ABc8jF1h8lKFO5UIu_!!6000000004233-2-tps-3456-2858.png)