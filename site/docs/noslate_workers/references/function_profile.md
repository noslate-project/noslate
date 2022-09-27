# 函数配置

函数元信息配置以 JSON 格式描述，具体字段如下：

|字段名|类型|描述|
|----|----|----|
|name|string|函数名，用于调用时识别具体哪个函数|
|url|string|函数代码包地址，格式为 zip，支持 http(s) 远程地址以及 file 本地地址|
|signature|string|代码包签名，用于判定代码包有效性以及是否有更新|
|runtime|string|Runtime 类型，可选值：nodejs-v16（v16.15.1）、aworker|
|handler|string|函数入口，仅在 runtime 为 nodejs-v16 时有效|
|initializer|string|初始化函数入口，仅在 runtime 为 nodejs-v16 时有效|
|sourceFile|string|函数执行文件名称，仅在 runtime 为 aworker 时有效|
|namespace|string，可选|资源空间，用于在多个函数间共享资源时使用|
|worker|[WorkerConfig，可选](#函数实例配置)|函数实例配置|
|environments|[Environment[]，可选](#环境变量)|函数所需环境变量|
|resourceLimit|[ResourceLimit，可选](#资源限制)|函数可使用资源限制|
|rateLimit|[RateLimit，可选](#限流配置)|函数限流配置|

### 函数实例配置
以下配置均为可选配置

|字段名|类型|描述|
|----|----|----|
|shrinkStrategy|string|缩容策略，默认值为 LCC，可选值：FILO（先创建后销毁）、FIFO（先创建先销毁）、LCC（销毁最小当前并发）|
|initializationTimeout|number|初始化超时时间，默认 10s|
|maxActivateRequests|number|最大同时执行请求数，默认为 10|
|reservationCount|number|预留实例数，默认为 0|
|replicaCountLimit|number|最大实例数，默认为 10|
|fastFailRequestsOnStarting|boolean|容器启动失败时是否直接返回报错，否则等待可用容器直到超时，默认为 true|
|v8Options|string[]|v8 参数|
|execArgv|string[]|aworker 执行参数|
|useCGIMode|boolean|是否使用 CGI 模式，默认为 false|

### 环境变量
格式如下：
```
{
    key: string;
    value: string;
}
```
指定容器实例需要的环境变量，如：
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
### 资源限制
以下配置均为可选配置

|字段名|类型|描述|
|----|----|----|
|memory|number|每个容器可用内存上限，默认为 500MB|
|cpu|number|每个容器可用 CPU 时间|

### 限流配置
以下配置均为可选配置，限流使用令牌桶模式：

|字段名|类型|描述|
|----|----|----|
|maxTokenCount|number|最大可用令牌数量|
|tokensPerFill|number|每次填充的令牌数|
|fillInterval|number|令牌填充间隔|
