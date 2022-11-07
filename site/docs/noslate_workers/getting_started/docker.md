# 通过 Docker 部署

Noslate 可以通过 Docker 镜像的形式快速部署到已有的集群架构中，配合上层调度实现更细粒度的调度以及高密度部署。

## 快速体验
如果想直接在本地体验 Noslate，操作如下：
```
docker pull ghcr.io/noslate-project/noslate-gateway:build-44
docker run -d ghcr.io/noslate-project/noslate-gateway:build-44
```

如果想定制镜像内容，可以继续阅读。

## 定制镜像
接下来，我们以搭建示例镜像的过来，来演示如何定制镜像：

### 确定依赖镜像版本
在[版本历史](https://github.com/noslate-project/noslate/pkgs/container/noslate)中确认自己要使用的版本号，并在 Dockerfile 中引入：
```
ARG NOSLATE_VERSION

FROM ghcr.io/noslate-project/noslate:${NOSLATE_VERSION}
```
以 build-44 为例，为了以后能方便的更新 Noslate，可以将版本作为一个构建参数传入，构建时指定：
```
docker build --build-arg NOSLATE_VERSION=build-44
```
### 创建所需目录
Noslate 镜像中已经将大部分所需目录创建完成，但日志文件目录并未创建，可以按照环境变量 **NOSLATE_LOGDIR** 指定的位置创建：
```
RUN mkdir -p $NOSLATE_LOGDIR
```
也可以按照需求覆盖该环境变量并创建文件目录：
```
ENV $NOSLATE_LOGDIR=/home/admin/logs
RUN mkdir -p $NOSLATE_LOGDIR
```
+ 如需了解更多关于日志处理的内容，可以参考[日志处理](noslate_workers/tutorials/logging.md)。
+ 如需了解更多环境变量的内容，可以参考[环境变量](noslate_workers/references/envionment_variables.md)
### 集成 Gateway 组件
+ [Gateway 组件介绍](noslate_workers/references/gateway.md)
+ [如何自定义 Gateway 组件](noslate_workers/tutorials/custom_gateway.md)

Gateway 组件的细节可以参考上面提供的两篇文档。在这里我们使用已经写好的 [Demo Gateway](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/gateway)，将它添加到镜像中。
```
ENV GATEWAY_PATH=/gateway
ENV GATEWAY_PORT=80

COPY resources/gateway $GATEWAY_PATH
```
### 定义 ENTRYPOINT
在 ENTRYPOINT 中，我们需要将 Noslate 的各个组件以及上面的 Gateway 运行起来：

#### 启动 Turfd
```
start_turfd() {
    TURF_LOG=${NOSLATE_LOGDIR}/turf.log
    nohup ${ALINODE_CLOUD_BIN}/turf -D -f >${TURF_LOG} 2>&1
}
```
#### 启动 Noslated
Noslated 包含 Data Plane 和 Control Plane 两部分，具体细节可以参考[Noslated 介绍](noslate_workers/noslated/intro)，两者的启动顺序没有要求。
```
start_planes() {
    node ${ALINODE_CLOUD_BIN}/data_plane &
    node ${ALINODE_CLOUD_BIN}/control_plane &
}
```
#### 启动 Gateway
Gateway 会与 Data Plane 和 Control Plane 建立连接，建议放在最后启动，同时用来保持容器运行。
```
start_gateway() {
    node ${GATEWAY_PATH}/server.js
}
```
这里提供一份写好的 [start.sh](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/start.sh) 用作参考。

将这个文件拷贝到镜像中，增加执行权限，指定为容器的 ENTRYPOINT。
```
COPY resources/start.sh /start.sh
ENTRYPOINT /start.sh start
```

### 构建镜像
至此，自定义镜像内容已经完成，我们执行构建即可。
```
docker build --build-arg NOSLATE_VERSION=0.0.1 noslate-demo.dockerfile -t noslate-demo
```
构建好直接运行即可：
```
docker run -d noslate-demo
```
