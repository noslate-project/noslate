# System Configuration

System configuration can be set in the form of configuration files, such as:
```
// config.json
// NOSLATED_CONFIG_PATH=config.json
{
    "worker": {
        "reservationCountPerFunction": 10
    }
}
```
|Configuration name|Type|Description|
|----|----|----|
|plane|[PlaneConfig](#plane)|plane configuration|
|controlPlane|[ControlPlaneConfig](#control-plane)|control plane configuration|
|virtualMemoryPoolSize|number|virtual memory pool size, used for overselling|
|worker|[WorkerConfig](#worker)|Worker Instance Default Configuration|
|systemCircuitBreaker|[SystemCircuitBreaker](#systemcircuitbreaker)|System circuit breaker configuration|
|delegate|[Delegate](#delegate)|Worker Instance Proxy Configuration|

## Plane
|Configuration name|Type|Description|
|----|----|----|
|dataPlaneCount|number|Number of Data Planes|
|planeFirstConnectionTimeout|number|plane connection timeout|

## Control Plane
|Configuration name|Type|Description|
|----|----|----|
|expandConcurrency|number|Worker instance expansion concurrency, default is 2|
|expandInterval|number|Expansion queue consumption interval, the default is setInterval(0)|

## Worker
|Configuration name|Type|Description|
|----|----|----|
|controlPlaneConnectTimeout|number|Control Plane connection timeout|
|defaultShrinkStrategy|string|Default scaling strategy, the default value is LCC, optional values: FILO (create first and then destroy), FIFO (create first and destroy first), LCC (destruct minimum current concurrency)|
|gcLogDelay|number|How long to clear the log residue after the worker instance is stopped, the default is 5 minutes|
|reservationCountPerFunction|number|Number of Reserved Instances per Worker Function|
|maxActivateRequests|number|Number of Reserved Instances per Worker Function|
|defaultInitializerTimeout|number|Default initialization timeout|
|replicaCountLimit|number|The upper limit of each Worker function instance|
|shrinkRedundantTimes|number|Idle judgment shrink time|

# SystemCircuitBreaker

|Configuration name|Type|Description|
|----|----|----|
|requestCountLimit|number|Maximum number of instant requests, default 10000|
|pendingRequestCountLimit|number|Waiting for the number of requests to go online, the default is 1000|
|systemLoad1Limit|number|System CPU Load upper limit, default 10|

# Delegate

|Configuration name|Type|Description|
|----|----|----|
|sockConnectTimeout|number|Worker connection timeout, default 5s|
|kvStoragePerNamespaceCapacity|number|The maximum number of kvStorage namespaces, the default is 8|
|kvStoragePerNamespaceMaxSize|number|The upper limit of the maximum storage quantity of kvStorage namespace, the default is 4096|
|kvStoragePerNamespaceMaxByteLength|number|	The maximum storage limit of kvStorage namespace, the default is 256MB|