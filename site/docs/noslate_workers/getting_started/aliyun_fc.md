# 在阿里云函数计算中使用

阿里云函数计算支持以容器镜像作为函数交付物，即 Custom Container 能力，因此可以将 Noslate 和函数计算结合，实现更细粒度的分级调度能力。

## 快速体验
可以参考[函数计算 - CustomContainer](https://help.aliyun.com/document_detail/179368.html)文档，将下面的镜像部署在函数计算中：
```
docker pull ghcr.io/noslate-project/noslate-gateway:build-44
```
其中 **build-44** 为版本号，可以在[版本历史](https://github.com/noslate-project/noslate/pkgs/container/noslate)中检索。

如果想定制镜像内容，可以继续阅读。

## 定制镜像
接下来，以上述示例镜像演示如何自定义函数计算容器镜像，该镜像使用 Web Server 模式，所以主要由两个部分组成：
1. Noslate
2. HTTP Server

### 定义 Noslate
如无自定义需求，可以直接使用 Noslate 提供的发行版本镜像：
```
ARG NOSLATE_VERSION

FROM ghcr.io/noslate-project/noslate:${NOSLATE_VERSION}
```

如有自定义需求，可以参考[通过 Docker 部署 Noslate](noslate_workers/getting_started/aliyun_fc.md)。

### 定义 HTTP Server
可以根据自己使用习惯选择框架提供 HTTP 服务，处理函数计算网关发来的调用并使用 Noslate 来处理请求返回结果。

函数计算发起的调用有：

|调用路径|请求|响应|
|----|----|----|
|/initialize|参考[函数计算公共请求头](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200：成功状态</li><li>404：失败状态</li></ul>|
|/pre-freeze|参考[函数计算公共请求头](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200：成功状态</li><li>404：失败状态</li></ul>|
|/pre-stop|参考[函数计算公共请求头](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200：成功状态</li><li>404：失败状态</li></ul>|
|/invoke|函数调用数据及[函数计算公共请求头](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|函数Handler的返回值，包括响应码和响应头。其中，StatusCode<ul><li>200：成功状态</li><li>404：失败状态</li></ul>|
更多详细内容参考[函数实例生命周期回调](https://help.aliyun.com/document_detail/427627.html)

根据具体需要，处理对应的请求即可，如有疑问可以参考[HTTP请求处理程序（HTTP Handler）](https://help.aliyun.com/document_detail/179371.html)。

为了能够将请求交给 Noslate 处理，在 **/invoke** 中需要做些引入 Noslate 提供的 [SDK](noslate_workers/references/sdk.md) 并转发请求，可以参考 [server.js](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/aliyun/server.js)：

```
// 镜像中预置的环境变量
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;

// 初始化 agent
const agent = new NoslatedClient();
await agent.start();

// 转发请求
app.post('/invoke', async (req, res) => {
    const response = await agent.invoke(functionName, req, metadata);

    response.pipe(res);
});
```
将 HTTP Server 集成到容器中，并将监听的端口对外暴露。
```
# 均可自定义
ENV SERVER_PATH=/code
ENV SERVER_PORT=9000

RUN mkdir ${SERVER_PATH}
COPY resources/aliyun/server.js ${SERVER_PATH}/server.js

EXPOSE ${SERVER_PORT}
```
### 定义 ENTRYPOINT
在 ENTRYPOINT 中，我们需要将 Noslate 的各个组件以及上面的 HTTP Server 运行起来：

#### 启动 Turfd
```
start_turfd() {
    TURF_LOG=${NOSLATE_LOGDIR}/turf.log
    nohup ${NOSLATE_BIN}/turf -D -f >${TURF_LOG} 2>&1
}
```
#### 启动 Noslated
Noslated 包含 Data Plane 和 Control Plane 两部分，具体细节可以参考[Noslated 介绍](noslate_workers/noslated/intro)，两者的启动顺序没有要求。
```
start_planes() {
    node ${NOSLATE_BIN}/data_plane &
    node ${NOSLATE_BIN}/control_plane &
}
```
#### 启动 HTTP Server
HTTP Server 会与 Data Plane 和 Control Plane 建立连接，建议放在最后启动，同时用来保持容器运行。
```
start_server() {
    node ${SERVER_PATH}/server.js
}
```
这里提供一份写好的 [start.sh](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/aliyun/start.sh) 用作参考。

将这个文件拷贝到镜像中，增加执行权限，指定为容器的 ENTRYPOINT。
```
COPY resources/aliyun/start.sh ${SERVER_PATH}/start.sh
ENTRYPOINT ${SERVER_PATH}/start.sh start
```

### 构建镜像
至此，自定义镜像内容已经完成，我们执行构建即可。
```
docker build --build-arg NOSLATE_VERSION=0.0.1 noslate-aliyunfc.dockerfile -t noslate-aliyunfc
```

之后按照阿里云函数计算的流程发布函数即可，参考[创建Custom Container函数](https://help.aliyun.com/document_detail/179372.html)。
