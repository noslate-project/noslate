# 系统配置

可以通过配置文件的形式设定系统配置，如：
```
// config.json
// ALICE_CONFIG=config.json
{
    "worker": {
        "reservationCountPerFunction": 10
    }
}
```
|配置名称|类型|描述|
|----|----|----|
|panel|[PanelConfig](#panel)|panel 配置|
|controlPanel|[ControlPanelConfig](#control-panel)|control panel 配置|
|virtualMemoryPoolSize|number|虚拟内存池大小，用于超卖|
|worker|[WorkerConfig](#worker)|worker 默认配置|
|systemCircuitBreaker|[SystemCircuitBreaker](#systemcircuitbreaker)|系统断路器配置|
|delegate|[Delegate](#delegate)|worker 代理配置|

## Panel
|配置名称|类型|描述|
|----|----|----|
|dataPanelCount|number|Data Panel 数量|
|panelFirstConnectionTimeout|number|panel 连接超时时间|

## Control Panel
|配置名称|类型|描述|
|----|----|----|
|expandConcurrency|number|容器扩容并发度，默认为 2|
|expandInterval|number|扩容队列消费间隔，默认为 setInterval(0)|

## Worker
|配置名称|类型|描述|
|----|----|----|
|controlPanelConnectTimeout|number|Control Panel 连接超时时间|
|defaultShrinkStrategy|string|默认缩容策略，默认值为 LCC，可选值：FILO（先创建后销毁）、FIFO（先创建先销毁）、LCC（销毁最小当前并发）|
|gcLogDelay|number|容器停止后多久清理日志残留，默认 5min|
|reservationCountPerFunction|number|每个函数预留容器数量|
|maxActivateRequests|number|最大同时执行请求数|
|defaultInitializerTimeout|number|默认初始化超时时间|
|replicaCountLimit|number|每个函数容器上限|
|shrinkRedundantTimes|number|空闲判定缩容时间|

# SystemCircuitBreaker
系统断路器配置

|配置名称|类型|描述|
|----|----|----|
|requestCountLimit|number|最大即时请求数，默认 10000|
|pendingRequestCountLimit|number|等待请求数上线，默认 1000|
|systemLoad1Limit|number|系统 CPU Load 上限，默认 10|

# Delegate

|配置名称|类型|描述|
|----|----|----|
|sockConnectTimeout|number|worker 连接超时时间，默认 5s|
|kvStoragePerNamespaceCapacity|number|kvStorage namespace 数量上限，默认为 8|
|kvStoragePerNamespaceMaxSize|number|kvStorage namespace 最大存储数量上限，默认 4096|
|kvStoragePerNamespaceMaxByteLength|number|kvStorage namespace 最大存储上限，默认 256MB|