# Outbound 服务代理
运行时 [Aworker](/docs/noslate_workers/design/aworker/intro) 的文件 I/O 和网络 I/O 能力受限，因此无法访问外部的服务。为了解决这个问题，在 Data Plane 中增加了 Outbound 服务代理能力，为了更容易理解，选用了 Dapr 调用格式为参考，设计了对应的接口。

```
interface DaprInvokeOptions {
    app: string;
    methodName: string;
    data: Buffer;
}

interface DaprBindingOptions {
    name: string;
    metadata: DaprBindingMetadata;
    operation: string;
    data: Buffer;
}

interface DaprResponse {
    status: number;
    data: Buffer;
}

interface DaprAdaptor {
    ready(): Promise<void>;
    invoke(params: DaprInvokeOptions): Promise<DaprResponse>;
    binding(params: DaprBindingOptions): Promise<DaprResponse>;
}
```
另外，在模块导出时，要使用 CommonJS 格式：
```
module.exports = class DaprAdaptor {};
```

如需，可以参考文档[自定义 Outbound 服务代理](noslate_workers/tutorials/custom_outbound.md)实现所需的 Outbound 服务代理。

在使用时，需要将代理模块地址通过 SDK 传入 Data Plane 中，Data Plane 会初始化该实例。

```
// 设置 DaprAdaptor
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;
const agent = new NoslatedClient();

await agent.setDaprAdaptor(modulePath);

// 初始化，会传入 logger 实现
const Clz = require(modulePath);
const adapter = new Clz(logger);

await adapter.ready();
```