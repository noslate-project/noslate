# Used in Alibaba Cloud Function Compute

Alibaba Cloud Function Compute supports the use of container images as function deliverables, that is the Custom Container capability. Therefore, Noslate can be combined with Function Compute to achieve more fine-grained hierarchical scheduling capabilities.

## Quick start
You can refer to the [Function Compute - CustomContainer](https://help.aliyun.com/document_detail/179368.html) document, to deploy the following images in Function Compute:: 
```
docker pull ghcr.io/noslate-project/noslate-aliyunfc:0.0.1
```

If you want to customize the mirror content, you can read the following steps.

## Custom image
Next, use the above example image to demonstrate how to customize the function computing container image. This image uses the Web Server mode, so it mainly consists of two parts:
1. Noslate
2. HTTP Server

### Define Noslate
If there is no image custom requirement, you can directly use the distribution image provided by Noslate:
```
ARG NOSLATE_VERSION

FROM noslate:${NOSLATE_VERSION:-0.0.1}
```

If there is custom image requirement [Deploy Noslate with Docker](noslate_workers/getting_started/aliyun_fc.md)。

### Define HTTP server
You can choose a framework to provide HTTP services according to your usage habits, process the calls sent by the function computing gateway, and use Noslate to process the request return results.

The calls made by Function Compute are:

|invoke path|request|reponse|
|----|----|----|
|/initialize|refer to [Function Compute Common Request Header](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200: Success Status</li><li>404: Failed Status</li></ul>|
|/pre-freeze|refer to [Function Compute Common Request Header](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200: Success Status</li><li>404: Failed Status</li></ul>|
|/pre-stop|refer to [Function Compute Common Request Header](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|StatusCode<ul><li>200: Success Status</li><li>404: Failed Status</li></ul>|
|/invoke|function call data and [Function Compute Common Request Header](https://help.aliyun.com/document_detail/425057.htm#section-3f8-5y1-i77)|The returned data of function handler, includes response codes and response headers.。StatusCode<ul><li>200: Success Status</li><li>404: Failed Status</li></ul>|
For more details refer to [Function instance lifecycle callback](https://help.aliyun.com/document_detail/427627.html)

To meet the spefic needs, you can process the corresponding request. If you have any questions, you can refer to the HTTP request handler [HTTP Handler](https://help.aliyun.com/document_detail/179371.html)。

In order to be able to hand over the request to Noslate for processing, in **/invoke**, you need to import the [SDK](noslate_workers/references/sdk.md) provided by Noslate and forward the request, you can refer to [server.js](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/aliyun/server.js): 

```
// Environment variables preset in the image
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;

// Initialize agent
const agent = new NoslatedClient();
await agent.start();

// Forward the request
app.post('/invoke', async (req, res) => {
    const response = await agent.invoke(functionName, req, metadata);

    response.pipe(res);
});
```
Integrate the HTTP Server into the container and expose the listening port to the outside
```
# Can be customized
ENV SERVER_PATH=/code
ENV SERVER_PORT=9000

RUN mkdir ${SERVER_PATH}
COPY resources/aliyun/server.js ${SERVER_PATH}/server.js

EXPOSE ${SERVER_PORT}
```
### Define ENTRYPOINT
In ENTRYPOINT, we need to run the various components of Noslate and the above HTTP Server:

#### Start Turfd
```
start_turfd() {
    TURF_LOG=${NOSLATE_LOGDIR}/turf.log
    nohup ${NOSLATE_BIN}/turf -D -f >${TURF_LOG} 2>&1
}
```
#### Start Noslated
Noslated includes Data Plane and Control Plane, for more details you can refer to [Noslated Inctroduction](noslate_workers/noslated/intro). The boot order of the two is not required。
```
start_planes() {
    node ${NOSLATE_BIN}/data_plane &
    node ${NOSLATE_BIN}/control_plane &
}
```
#### Start HTTP server
The HTTP Server will establish a connection with the Data Plane and Control Plane, and it is recommended to start it at the end to keep the container running.
```
start_server() {
    node ${SERVER_PATH}/server.js
}
```
Here is a written [start.sh](https://github.com/noslate-project/noslate_workers/tree/main/distro/resources/aliyun/start.sh) for reference。

Copy this file to the image, increase the execution permission, and specify it as the ENTRYPOINT of the container.
```
COPY resources/aliyun/start.sh ${SERVER_PATH}/start.sh
ENTRYPOINT ${SERVER_PATH}/start.sh start
```

### Build image
At this point, the custom image content has been completed, and we can execute the build.
```
docker build --build-arg NOSLATE_VERSION=0.0.1 noslate-aliyunfc.dockerfile -t noslate-aliyunfc
```

After that, you can publish the function according to the Alibaba Cloud function computing process, refer to [Create Custom Container Function](https://help.aliyun.com/document_detail/179372.html)。
