# Environment Variable

## Built-in environment
|variable name|description|
|----|----|
|NOSLATE_PATH|	Noslate installation directory, generally used when introducing SDK|
|NOSLATE_WORKDIR|Noslate working directory, such as: code package, instance configuration, etc.|
|NOSLATE_BIN|Noslate execution directory, including: turf, data_plane, control_plane, aworker, etc.|
|NOSLATE_LOGDIR|Noslate log directory|

## Specify system configuration with environment variables
|variable name|description|
|----|----|
|NOSLATED_CONFIG_PATH|Noslated configuration file path|
|NOSLATED_VIRTUAL_MEMORY_POOL_SIZE|Virtual memory pool size|
|NOSLATED_RESERVATION_WORKER_COUNT_PER_FUNCTION|The default reservation limit of each Worker function instance|
|NOSLATED_REPLICA_COUNT_LIMIT_PER_FUNCTION|Default limit for each Worker function instance|
|NOSLATED_MAX_ACTIVATE_REQUESTS|The default maximum number of simultaneous requests per Worker function|
|NOSLATED_WORKER_SHRINK_REDUNDANT_TIMES|The redundant interval of shrink|

## Specify the environment variables available to the working instance
The environment variables used by the default Worker instance are isolated from the environment variables in the system to prevent pollution and control the reading range. If there are environment variables in the system that need to be accessed by the Worker instance, you can set a whitelist.

The SDK provides the **setPlatformEnvironmentVariables** method for setting the whitelist:
```
await agent.setPlatformEnvironmentVariables([
    {
        key: 'NODE_ENV',
        value: 'production'
    }
]);
```
