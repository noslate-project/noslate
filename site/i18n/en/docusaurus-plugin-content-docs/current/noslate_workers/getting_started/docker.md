# Deploy Noslate with Docker

Noslate can be quickly deployed into the existing cluster architecture in the form of Docker images, and cooperate with upper-level scheduling to achieve finer-grained scheduling and high-density deployment.

## Quick start
If you want to experience Noslate directly locally, do the following:
```
docker pull ghcr.io/noslate-project/noslate-demo:0.0.1
docker run -d ghcr.io/noslate-project/noslate-demo:0.0.1
```

If you want to customize the mirror content, you can continue reading.

## Custom image
Next, let's build a sample image to demonstrate how to customize the image:

### Determine the dependent image version
Confirm the version number you want to use in [version history](noslate_workers/release_notes.md), and introduce it in the Dockerfile:
```
ARG NOSLATE_VERSION

FROM noslate:${NOSLATE_VERSION:-0.0.1}
```
Taking 0.0.1 as an example, in order to easily update Noslate in the future, the version can be passed in as a build parameter, and specified when building:

```
docker build --build-arg NOSLATE_VERSION=0.0.1
```
### Create the required directory
Most of the required directories have been created in the Noslate image, but the log file directory has not been created. It can be created according to the location specified by the environment variable **NOSLATE_LOGDIR**:
```
RUN mkdir -p $NOSLATE_LOGDIR
```
It is also possible to override this environment variable and create a directory of files as required:
```
ENV $NOSLATE_LOGDIR=/home/admin/logs
RUN mkdir -p $NOSLATE_LOGDIR
```
+ For more information about log processing, please refer to [Log Processing](noslate_workers/tutorials/logging.md).
+ For more information about environment variables, please refer to [Environment Variables](noslate_workers/references/envionment_variables.md)
### Integrate Gateway components
+ [Gateway component introduction](noslate_workers/references/gateway.md)
+ [How to Customize Gateway Components](noslate_workers/tutorials/custom_gateway.md)

Details of the Gateway component can be found in the two documents provided above. Here we use the already written [Demo Gateway](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/gateway) and add it to the image.
```
ENV GATEWAY_PATH=/gateway
ENV GATEWAY_PORT=80

COPY resources/gateway $GATEWAY_PATH
```
### Define ENTRYPOINT
In ENTRYPOINT, we need to run the components of Noslate and the Gateway above:

#### Start Turfd
```
start_turfd() {
    TURF_LOG=${NOSLATE_LOGDIR}/turf.log
    nohup ${ALINODE_CLOUD_BIN}/turf -D -f >${TURF_LOG} 2>&1
}
```
#### Start Noslated
Noslated consists of two parts, Data Plane and Control Plane. For details, please refer to the introduction of Noslated. The startup sequence of the two is not required.
```
start_planes() {
    node ${ALINODE_CLOUD_BIN}/data_plane &
    node ${ALINODE_CLOUD_BIN}/control_plane &
}
```
#### Start Gateway
The Gateway will establish a connection with the Data Plane and Control Plane, and it is recommended to start it last while keeping the container running.
```
start_gateway() {
    node ${GATEWAY_PATH}/server.js
}
```
Here is a written [start.sh](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/start.sh) for reference.

Copy this file to the image, increase the execution permission, and specify it as the ENTRYPOINT of the container.

```
COPY resources/start.sh /start.sh
ENTRYPOINT /start.sh start
```

### Build image
At this point, the custom image content has been completed, and we can execute the build.
```
docker build --build-arg NOSLATE_VERSION=0.0.1 noslate-demo.dockerfile -t noslate-demo
```
After building it, run it directly:
```
docker run -d noslate-demo
```
