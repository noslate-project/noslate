# 弹性策略

Alice 整体的设计理念是容器基于流量拉起，快弹慢缩。

## 一、基础策略
当流量进入 Data Panel 后，如果没有能够处理请求的容器，会通过 **requestQueueing** 事件通知 Control Panel，它会根据当前水位决定扩容数量，如果当前已无法创建容器，会返回资源上限报错。新的容器启动后，会自动连接到 Data Panel，Data Panel 发现新的容器连接后会主动触发初始化请求，初始化成功后开始消费请求队列里堆积的请求。

当容器闲置一段时间后，Control Panel 会主动发起 GC 操作，告知 Data Panel 关闭流量，流量关闭后，Control Panel 会通知 Turf 关闭容器，清理资源残留。

![基本流程](https://gw.alicdn.com/imgextra/i2/O1CN01qaQudn25qJm4OmOHM_!!6000000007577-0-tps-5029-4249.jpg)

## 二、预留策略
有的函数启动时间会比较长，为了能够及时的响应请求，提供了函数最小实例数配置，即预留配置。流量到来时会直接筛选可用容器并分发流量，如果流量水位过高，会按照（一）中策略执行扩容操作，并在空闲时缩容，但是缩容结果不会小于最小实例数配置的值。

```
// 函数配置
{
    "worker": {
        "reservationCount": 1
    }
}
```

![预留策略](https://gw.alicdn.com/imgextra/i1/O1CN01w93Qlt28kJQX4aJvj_!!6000000007970-0-tps-5029-4249.jpg)

## 三、CGI 模式
针对特殊场景，如用户脚本执行，为了隔离不同请求间的上下文，可以针对每个请求创建一个容器，并在执行后销毁。

```
// 函数配置
{
    "worker": {
        "useCGIMode": true
    }
}
```

![CGI 模式](https://gw.alicdn.com/imgextra/i4/O1CN01ejJyng1nWvvKg56oP_!!6000000005098-0-tps-5029-4249.jpg)

Node.js 函数一般启动时间较长，可以使用 Aworker 运行时并配合 [Warmfork](./warmfork) 能力，更快完成函数启动。

## 四、缩容策略
默认的缩容策略是选择当前最小并发度的容器，即最空闲的容器。但是还支持其他两种策略，FIFO（先创建先销毁）和FILO（先创建后销毁），可以在函数配置中设置。
```
type ShrinkStrategy = 'FILO' | 'FIFO' | 'LCC';
// 函数配置
{
    "worker": {
        "shrinkStrategy": "LCC"
    }
}
```
