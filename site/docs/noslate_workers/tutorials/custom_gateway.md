# 自定义 Gateway

跟随本教程，我们将实现一个基于 HTTP 的自定义 Gateway 模块，通过监听 9000 端口，处理调用请求。

本教程中涉及的代码：[Custom Gateway](https://github.com/noslate-project/noslate/tree/main/examples/gateway)

## 配置存储
为了方便体验 Gateway 的效果，我们引入 sqlite3 将 Noslated Workers 的函数配置信息持久化存储。

初始化数据库：

```bash title="创建 gateway.db"
sqlite3 gateway.db
```

```sql title="创建 function_profile 及 service_profile 数据表"
CREATE TABLE function_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  name CHAR(50) NOT NULL,
  codeInfo TEXT NOT NULL,
  namespace CHAR(50),
  workerConfig TEXT,
  environments TEXT,
  resourceLimit TEXT,
  rateLimit TEXT
);

CREATE TABLE service_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  name CHAR(50) NOT NULL,
  type CHAR(50) NOT NULL,
  selectors TEXT NOT NULL
);
```

## Gateway 实现

本教程中我们选择 [Express](https://expressjs.com/) 作为 Gateway 的服务框架，你可以使用任意熟练的 Web 框架来替代。

```bash
npm install express --save
```

在 Gateway 中我们会涉及配置的增删改查以及函数的调用，因此会提供如下如有供访问：

```js title="Gateway 路由"
// 函数、服务调用
app.post('/invoke', this.invokeHandler);

// 新增函数
app.post('/addFunction', this.addFunction);
// 新增服务
app.post('/addService', this.addService);
// 查看函数
app.get('/listFunction', this.listFunction);
// 查看服务
app.get('/listService', this.listService);
// 移除函数
app.post('/removeFunction', this.removeFunction);
// 移除服务
app.post('/removeService', this.removeService);
```

接下来我们主要对 `/invoke` 的 invokeHandler 展开讲解，其他的增删改查实现可以参考[示例代码](https://github.com/noslate-project/noslate/tree/main/examples/gateway)或者按照自己的需求实现。

### Noslated Client
Noslated Client 负责将 Noslated 和 Gateway 进行连接，通过它可以将请求转发到 Noslated Workers 系统中执行。因此，需要先将它初始化。

```js title="初始化 Noslated Client"
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;
this.agent = new NoslatedClient();

await this.agent.start();
await this.updateFunctionProfiles();
await this.updateServiceProfiles();
```

### 读取数据库配置并生效
我们将函数配置存储在数据库中，启动时需要读取出来并设置到 Noslated 中。将配置读取出来，并转换成所需格式后，调用 NoslatedClient 提供的 `setFunctionProfile` 和 `setServiceProfile` 更新配置。

格式参考：
1. [Worker 函数配置](../references/function_profile.md)
2. [服务路由配置](../references/service_profile.md)

目前 Noslated 没有内置配置管理能力，当新配置到来时，会和之前的配置对比差异（处理容器变化），并全量覆盖，所以每次配置发生变化时（如：增、删、改）都需要重新设置生效。

```js title="更新配置"
// 更新 Worker 函数配置
async updateFunctionProfiles() {
  let profiles = await FunctionProfile.findAll({
    raw: true
  });

  profiles = profiles.map((profile) => {
    return Object.assign({
      name: profile.name,
      namespace: profile.namespace,
      worker: JSON.parse(profile.workerConfig),
      resourceLimit: JSON.parse(profile.resourceLimit),
      environments: JSON.parse(profile.environments),
      rateLimit: JSON.parse(profile.rateLimit)
    }, JSON.parse(profile.codeInfo));
  });

  await this.client.setFunctionProfile(profiles);
}

// 更新服务路由配置
async updateServiceProfiles() {
  let profiles = await ServiceProfile.findAll({
    raw: true
  });

  profiles = profiles.map((profile) => {
    let item = {
      name: profile.name,
      type: profile.type
    };

    const selectors = JSON.parse(profile.selectors);

    if (profile.type === 'default') {
      item.selector = selectors[0].selector;
    } else {
      item.selectors = selectors;
    }

    return item;
  });

  await this.client.setServiceProfile(profiles);
}
```

### invokeHandler
在本教程中，我们约定通过 HTTP Headers 里的 `x-noslated-dispatch` 来识别调用的是哪个服务或函数，格式为 `(function|service):${name}`，如：

```bash title="curl 调用示例"
curl http://127.0.0.1:9000/invoke -X POST -H 'x-noslated-dispatch: service:A' -H 'x-noslated-request-id: 123'
curl http://127.0.0.1:9000/invoke -X POST -H 'x-noslated-dispatch: function:B' -H 'x-noslated-request-id: 456'
```
另外，可以通过指定 `x-noslated-request-id` 来跟踪请求在 Noslated 的执行情况。

NoslatedClient 提供了 `invoke` 和 `invokeService` 方法，用来处理不同调用类型，具体的方法签名可以查看 [API References](https://noslate-project.github.io/noslated/classes/NoslatedClient.html)。

两个方法都接受流为入参，并返回流作为结果，因此可以直接使用 [Request](https://expressjs.com/en/4x/api.html#req) 和 [Response](https://expressjs.com/en/4x/api.html#res) 对象。

调用需要传入的 metadata，其中的 method、url、headers 在函数中都可以获取到，用来识别调用信息。需要注意的是 headers 的传入格式比较特殊，需要将 KeyValue 的 Map 装换成 Array，如：

```js title="转换示例"
// 转换前
{
  "user-agent": "xxx"
}
// 转换后
[
  ["user-agent", "xxx"]
]
```

```js title="invokeHandler 示例"
async invoke(invokeTarget, req, res) {
  const { type, alias } = invokeTarget;

  const metadata = {
    method: req.method,
    url: req.url,
    headers: objectToArray(req.headers),
    requestId: req.headers['x-noslated-request-id'] || 'unknown'
  };

  try {
    let response;

    if (type === 'function') {
      response = await this.client.invoke(alias, req, metadata);
    } else if (type === 'service') {
      response = await this.client.invokeService(alias, req, metadata);
    } else {
      res.status(500).send('invoke type not supported.');
      return;
    }

    response.pipe(res);
  } catch (error) {
    res.status(500).send(error.message + '\n');
  }
}
```
