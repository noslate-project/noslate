# 环境变量

## 内置环境变量
|变量名称|描述|
|----|----|
|NOSLATE_PATH|Noslate 安装目录，一般用于引入 SDK 时|
|NOSLATE_WORKDIR|Noslate 工作目录，存放如：代码包，容器配置等|
|NOSLATE_BIN|Noslate 执行目录，包含：turf、data_pane、control_panel、aworker 等|
|NOSLATE_LOGDIR|Noslate 日志目录|

## 通过环境变量指定系统配置
|变量名称|描述|
|----|----|
|ALICE_CONFIG|Noslated 配置文件地址|
|ALICE_VIRTUAL_MEMORY_POOL_SIZE|虚拟内存池大小|
|ALICE_RESERVATION_WORKER_COUNT_PER_FUNCTION|默认每个函数预留数量|
|ALICE_REPLICA_COUNT_LIMIT_PER_FUNCTION|默认每个函数容器上限|
|ALICE_MAX_ACTIVATE_REQUESTS|默认每个函数最大同时处理请求数|
|ALICE_WORKER_SHRINK_REDUNDANT_TIMES|缩容空闲间隔|

## 指定工作实例可用环境变量
默认容器使用的环境变量是和系统中环境变量隔离的，防止产生污染、控制读取范围。如有系统中存在环境变量需要被容器访问到，可以设置白名单。

SDK 提供了 **setPlatformEnvironmentVariables** 方法用于设置白名单：
```
await agent.setPlatformEnvironmentVariables([
    {
        key: 'NODE_ENV',
        value: 'production'
    }
]);
```
