# 自定义 Gateway

在此，以 HTTP Server 为例介绍如何实现一个自定义的 Gateway 模块：

#### 1. 创建一个 HTTP Server
```
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});

server.listen(8000);
```

#### 2. 创建 Agent 对象并初始化
```
const AliceAgent = require(process.env.NOSLATE_PATH).AliceAgent;
const agent = new AliceAgent();

await agent.start();
```

### 3. 解析 HTTP 请求并转发
```
// 调用目标是请求头中的 x-noslate-target 指定
const target = headers['x-noslate-target'];
const targetArr = target.split(':);
let _res;

if (targetArr[0] === 'service') {
    _res = await invokeService(targetArr[1], req, { headers: req.headers, url: req.url, method: req.method });
} else {
    _res = await invoke(targetArr[1], req, { headers: req.headers, url: req.url, method: req.method });
}

_res.pipe(res);
```

### 4. 支持更新配置
订阅远端函数配置，并更新
```
setInterval(async () => {
    const config = await fetch(configUrl);

    await agent.setFunctionProfile(url);
}, 60 * 1000);
```