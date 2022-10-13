# 自定义 Outbound 服务代理

Aworker 作为 Web-interoperable 运行时，除了能够通过 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 访问 HTTP 资源外，其他的 RPC 调用类型自身是不支持的。因此，在 Data Plane 侧提供了扩展 [Outbound 服务代理](../references/outbound.md)的机制，本教程以查询数据库为例，一步步实现一个自定义的 Outbound 服务代理。

实例代码可以通过 [Outbound 服务代理示例](https://github.com/noslate-project/noslate/tree/main/examples/outbound) 查看。

我们设想两个场景：
1. 通过名称模糊搜索商品（findByName）
2. 查询库存在某个水位线上的商品（listStock）

```typescript title="方法定义"
findByName(name: string): Promise<Product[]>;
listStock(page: number, pageSize: number, count: number): Promise<Product[]>;
```

因此我们需要在 Outbound 代理中支持 findByName 和 listStock 两个调用。因为 findByName 只有一个参数，我们选择用 invoke 调用来实现，而 listStock 则通过 binding 调用来实现。实际使用时可以按照你的需要来设计，可以只使用一种形式，也可以两种都使用，这里仅用来展示两个实现方式。

invoke 调用接受三个参数，appId，methodName，data。前两者为 string 类型，用来识别具体调用，data 则为 Buffer 类型，承载调用数据。

binding 调用接受四个参数，name，metadata，operation，data。name 和 operation 为 string 类型，用来识别具体调用；metadata 则用于传递调用的相关信息，如 listStock 中的 page 和 pageSize。data 同上，为 Buffer 类型，承载调用数据。

两者的返回均为统一的结构：

```typescript title="类型定义"
interface DaprResponse {
  status: number;
  data: Buffer;
}
```
接收方可以通过 status 来判断是否执行成功，一般我们会参考 [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 来设计对应的值。

```js title="示例"
async invoke(options) {
  const { appId, methodName, data } = options;

  if (appId !== 'sqlite') {
    return {
      status: 404,
      data: `appId: ${appId} not support`
    };
  }

  if (methodName !== 'findByName') {
    return {
      status: 404,
      data: `methodName: ${methodName} not support`
    };
  }

  return this.findByName(data.toString());
}

async binding(options) {
  const { name, metadata, operation, data } = options;

  if (name !== 'sqlite') {
    return {
      status: 404,
      data: `${name} not support`
    };
  }

  if (operation !== 'listStock') {
    return {
      status: 404,
      data: `operation: ${operation} not support`
    }
  }

  return this.listStock(metadata.page, metadata.pageSize, data.toString());
}
```

## 加载自定义 Outbound 服务代理

导出模块时要注意使用 CommonJS 格式，不然可能会无法加载。
```js
module.exports = class OutboundProxy {
  // Data Plane 会注入 Logger 用来输出日志
  constructor({ logger }) {}
}
```

我们在 NoslatedClient 初始化过程中，可以设置 Outbound 服务代理模块的引用路径，之后会在 Data Plane 中根据该模块创建代理实例。因为涉及跨进程通信，所以只能传递文本形式的引用路径。

```js
await client.setDaprAdaptor(${OutboundModulePath});
```

## 函数使用
Aworker 函数可以通过全局变量 aworker 获取到调用代理的方法。

```js title="示例"
const dapr = aworker.Dapr['1.0'];
```

```js title="invoke 调用"
const response = await dapr.invoke({
  app: 'sqlite',
  method: 'findByName',
  body: 'Sugar',
});
```

```js title="binding 调用"
const response = await dapr.binding({
  name: 'sqlite',
  metadata: {
    page: 1,
    pageSize: 10
  },
  operation: 'listStock',
  body: '50',
});
```

