# Flexible Strategy

The overall design concept of Noslated is that Worker instances are pulled up based on traffic, quickly expanded, and slowly reduced.

## 1. basic strategy
After the traffic enters the Data Plane, if there is no Worker instance that can process the request, it will notify the Control Plane through the **requestQueueing** event, and it will decide the amount of expansion based on the current water level. If the Worker instance cannot be created, it will return the resource limit. report an error. After the new Worker instance is started, it will automatically connect to Data Plane. After Data Plane finds that the new Worker instance is connected, it will actively trigger an initialization request. After the initialization is successful, it will start to consume the accumulated requests in the request queue.

When the Worker instance is idle for a period of time, Control Plane will actively initiate a GC operation to tell Data Plane to close the traffic. After the traffic is closed, Control Plane will notify Turf to close the Worker instance and clean up the remaining resources.

![基本流程](../../assets/noslated_normal_scale.png)

## 2. Disposable Mode
For specific flexible scenarios, such as user script execution, in order to isolate the context between different requests, a Worker instance can be created for each request and destroyed after execution.

```
// Worker instance configuration
{
    "worker": {
        "disposable": true
    }
}
```

![即抛模式](../../assets/noslated_disposable_mode.png)

The startup time of Node.js Worker instances is generally long. You can use the Aworker runtime with [Warmfork](../aworker/intro.md#warmfork) and [Startup Snapshot](../aworker/intro.md#startup-snapshot) capability to complete Worker instance startup faster.


## 3. Reservation Strategy
Some Worker instances take a long time to start. In order to respond to requests in a timely manner, the minimum number of worker instances is configured, that is, the reserved configuration. When the traffic arrives, it will directly filter the available Worker instances and distribute the traffic. If the traffic level is too high, the capacity expansion operation will be performed according to the strategy in (1), and the capacity will be scaled down when idle, but the scaling result will not be less than the value configured by the minimum number of instances.

```
// Worker instance configuration
{
    "worker": {
        "reservationCount": 1
    }
}
```

![预留策略](../../assets/noslated_reserved_scale.png)

## 4. Shrink Strategy
The default scaling strategy is to select the Worker instance with the current minimum concurrency, that is, the most idle Worker instance. However, two other strategies are also supported, FIFO (create first, destroy first) and FILO (create first and then destroy), which can be set in the Worker instance configuration.

```
type ShrinkStrategy = 'FILO' | 'FIFO' | 'LCC';
// Worker instance configuration
{
    "worker": {
        "shrinkStrategy": "LCC"
    }
}
```
