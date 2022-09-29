# Noslated

Noslate Container Deamon，作为 Noslate Serverless 解决方案的核心，提供了 Serverless 需要的 Worker 实例调度、弹性扩容、配置管理、流量管理等能力。

它由两个角色组成：
1. 控制面（Control Plane）
2. 数据面（Data Plane）

![Noslated 结构](../../assets/noslated_arch.png)

## 控制面（Control Plane）
作为 Noslated 的大脑，负责保障整个系统的正常运行，它整合当前系统的运行指标，评估当前水位，并根据[既定策略](noslate_workers/references/scale.md)实现 Worker 实例数量的动态调配。

### 配置管理
Worker 函数的元信息和服务路由配置均由 Control Plane 管理，并分发给 Data Plane 使用。当收的配置更新时，会和已有配置做对比，更新 Worker 函数代码包及对应 Worker 实例。

在 Noslated 系统中存在三种配置：
1. [Worker 函数配置](noslate_workers/references/function_profile)
2. [服务路由配置](noslate_workers/references/service_profile)
3. [系统配置](noslate_workers/references/system_config)

以更新 Worker 函数配置为例：
![Worker 函数配置](../../assets/noslated_function_profile.png)

## 数据面板（Data Plane）
Data Plane 是 Noslated 的请求主链路，所有流量均通过 Data Plane 流经对应的工作实例，在得到 Worker 函数调用指令后，决定将数据发送给哪个 Worker 实例。

另外，Worker 实例对外的请求均是由 Data Plane 作为代理执行。