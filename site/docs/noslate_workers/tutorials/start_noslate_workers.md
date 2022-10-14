# 如何启动 Noslate Workers

如 [Noslate Workers](../noslated/intro.md) 中介绍的，Noslate Workers 包含多个组成部分，以及用户自定的 Gateway、Outbound 代理等，因此它的启动流程也尤为重要。

本教程提供了一份可供参考的启动脚本，可以直接取用 [start.sh](https://github.com/noslate-project/noslate/tree/main/examples/start.sh)。

下面来分析下这个脚本做了什么。

## start_turf
首先，我们要启动 Noslate Workers 中的 Turf Deamon，由它实现 Worker 函数实例间的隔离。

+ `-D` 参数用来标识 turf 以 Deamon 形式启动。
+ `-f` 参数用来标识 Deamon 运行在前台（foreground）

```bash title="启动 turfd"
start_turf() {
  nohup ${NOSLATE_BIN}/turf -D -f >${TURF_LOG} 2>&1 || log_exit turfd &
  log "[Noslate - Turf] turfd started."
}
```

## start_planes
我们使用 Noslate 自带的 Node.js（没有特别定制，仅为了保持环境一致）启动 Data Plane、Control Plane 以及自定义的 Gateway。

```bash title="启动各组件"
start_planes() {
  ${NOSLATE_BIN}/node ${NOSLATE_BIN}/data_plane >${DATA_PLANE_OUTPUT} 2>&1 || log_exit data_plane &
  DATA_PLANE_PID=$!
  log "[Noslate - Noslated] data plane started as $DATA_PLANE_PID."
  ${NOSLATE_BIN}/node ${NOSLATE_BIN}/control_plane >${CONTROL_PLANE_OUTPUT} 2>&1 || log_exit control_plane &
  CONTROL_PLANE_PID=$!
  log "[Noslate - Noslated] control plane started as $CONTROL_PLANE_PID."
  ${NOSLATE_BIN}/node ${GATEWAY_PATH}/gateway >${GATEWAY_OUTPUT} 2>&1 || log_exit gateway &
  GATEWAY_PID=$!
  log "[Noslate - Gateway] started as $GATEWAY_PID."

  # exit the container once any of the subprocess exited unexpectically.
  wait_panels $DATA_PLANE_PID $CONTROL_PLANE_PID $GATEWAY_PID
}
```

我们通过 `&` 让所有组件进程运行在后台，一般我们会以 start.sh 作为容器镜像的入口，为了让组件异常退出能够及时被发现，我们使用了 `wait` 方法，确保容器能够持续运行，并在发生问题时能够及时退出，触发容灾机制，如：容器轮转等。

为了能够获取到每个组件的退出码，增加了 log_exit 函数，方便诊断问题，如： OOM kill 等情况。

```bash
log_exit() {
  EXIT_CODE=$?
  echo $1 exited with $EXIT_CODE
  exit $EXIT_CODE
}
```