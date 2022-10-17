# Worker Function Configuration

Worker function meta information configuration is described in JSON format, and the specific fields are as follows:

|name|type|description|
|----|----|----|
|name|string|Worker function name, which is used to identify the specific Worker function when calling|
|url|string|Worker function code package address, the format is zip, supports http(s) remote address and file local address|
|signature|string|Code package signature, used to determine the validity of the code package and whether there is an update|
|runtime|string|Runtime type, optional values: nodejs-v16 (v16.15.1), aworker|
|handler|string|Worker function entry, only valid when the runtime is nodejs-v16|
|initializer|string|Initialize Worker function entry, only valid when runtime is nodejs-v16|
|sourceFile|string|Worker function execution file name, only valid when runtime is aworker|
|namespace|string, optional |Resource space, used when sharing resources among multiple Worker functions|
|worker|[WorkerConfig, optional](#worker-function-configuratio)|Worker Function instance configuration|
|environments|[Environment[], optional](#environment-variable)|Worker Environment variables required by the function|
|resourceLimit|[ResourceLimit, optional](#Resource-constraints)|Worker Functions can use resource limits|
|rateLimit|[RateLimit, optional](#Limiting-configuration)|Worker Function current limiting configuration|


### Worker Function instance configuration
The following configurations are optional

|name|type|description|
|----|----|----|
|shrinkStrategy|string|Shrinking strategy, the default value is LCC, optional values: FILO (create first and then destroy), FIFO (create first and destroy first), LCC (destruct minimum current concurrency)|
|initializationTimeout|number|Initialization timeout, default 10s|
|maxActivateRequests|number|The maximum number of simultaneous execution requests, the default is 10|
|reservationCount|number|The number of reserved instances, the default is 0|
|replicaCountLimit|number|Maximum number of instances, default is 10|
|fastFailRequestsOnStarting|boolean|Whether to return an error directly when the worker instance fails to start, otherwise wait for an available instance until the timeout, the default is true|
|v8Options|string[]|v8 parameters|
|execArgv|string[]|aworker execution parameters|
|disposable|boolean|Whether to use the disposable mode, the default is false|

### environment variable
The format is as follows:
```
{
    key: string;
    value: string;
}
```
Specify the environment variables required by the Worker instance, such as:
```
{
    "environments": [
        {
            "key": "NODE_ENV",
            "value": "production"
        }
    ]
}
```
### Resource Limits
The following configurations are optional

|name|type|description|
|----|----|----|
|memory|number|The upper limit of available memory for each worker instance, the default is 500MB|
|cpu|number|Available CPU time per worker instance|

### Current limiting configuration
The following configurations are optional, and the token bucket mode is used for current limit:

|name|type|description|
|----|----|----|
|maxTokenCount|number|Maximum number of tokens available|
|tokensPerFill|number|Number of tokens per fill|
|fillInterval|number|Token Fill Interval|
