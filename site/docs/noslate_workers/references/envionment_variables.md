# 环境变量

## 内置环境变量
|变量名称|描述|
|----|----|
|NOSLATE_PATH|Noslate 安装目录，一般用于引入 SDK 时|
|NOSLATE_WORKDIR|Noslate 工作目录，存放如：代码包，实例配置等|
|NOSLATE_BIN|Noslate 执行目录，包含：turf、data_plane、control_plane、aworker 等|
|NOSLATE_LOGDIR|Noslate 日志目录|

## 通过环境变量指定系统配置
|变量名称|描述|
|----|----|
|NOSLATED_CONFIG_PATH|Noslated 配置文件地址|
|NOSLATED_VIRTUAL_MEMORY_POOL_SIZE|虚拟内存池大小|
|NOSLATED_RESERVATION_WORKER_COUNT_PER_FUNCTION|默认每个 Worker 函数预留数量|
|NOSLATED_REPLICA_COUNT_LIMIT_PER_FUNCTION|默认每个 Worker 函数实例上限|
|NOSLATED_MAX_ACTIVATE_REQUESTS|默认每个 Worker 函数最大同时处理请求数|
|NOSLATED_WORKER_SHRINK_REDUNDANT_TIMES|缩容空闲间隔|

## 指定工作实例可用环境变量
默认 Worker 实例使用的环境变量是和系统中环境变量隔离的，防止产生污染、控制读取范围。如有系统中存在环境变量需要被 Worker 实例访问到，可以设置白名单。

SDK 提供了 **setPlatformEnvironmentVariables** 方法用于设置白名单：
```
await agent.setPlatformEnvironmentVariables([
    {
        key: 'NODE_ENV',
        value: 'production'
    }
]);
```
