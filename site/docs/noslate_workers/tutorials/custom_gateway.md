# 自定义 Gateway

跟随本教程，我们将实现一个基于 HTTP 的自定义 Gateway 模块，同时可以通过 sqllite 持久化存储函数信息。

## 数据存储
在本示例中，我们选择 sqlite3 作为存储，首先先创建一个数据库：
```
> sqlite3 gateway.db
```
然后我们创建两张表，用来存储函数配置以及服务路由配置：
```
sqlite> CREATE TABLE function_profile (
  id INT PRIMARY KEY NOT NULL,
  name CHAR(50) NOT NULL,
  codeInfo TEXT NOT NULL,
  namespace CHAR(50),
  workerConfig TEXT,
  environments TEXT,
  resourceLimit TEXT,
  rateLimit TEXT
);

sqlite> CREATE TABLE service_profile (
  id INT PRIMARY KEY NOT NULL,
  name CHAR(50) NOT NULL,
  type CHAR(50) NOT NULL,
  selectors TEXT NOT NULL
);
```

## HTTP Server
在本示例中，我们选择 expressjs 作为服务框架。
```
> npm install express --save
```

gateway 提供如下路由：
```
// gateway.js
app.post('/invoke', this.invoke);

// function、service CURD
app.post('/addFunction', this.addFunction);
app.post('/addService', this.addService);
app.get('/listFunction', this.listFunction);
app.get('/listService', this.listService);
app.post('/removeFunction', this.removeFunction);
app.post('/removeService', this.removeService);
```

然后我们初始化 sqllite db 和 alice agent。

```
// init db
this.db = new Sequelize({
  dialect: 'sqlite',
  storage: './gateway.db'
});

// init agent
const AliceAgent = require(process.env.NOSLATE_PATH).AliceAgent;
this.agent = new AliceAgent();

await this.agent.start();
```

### /invoke
将请求转发到 Noslate 并执行是整个 Gateway 的核心能力，所以先来看这部分的实现。

在当前 gateway 实现中，我们约定具体调用的目标以 query 参数 target 传入，格式为 —— **目标类型|目标名称**，目标类型取值为 function 或 service。

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