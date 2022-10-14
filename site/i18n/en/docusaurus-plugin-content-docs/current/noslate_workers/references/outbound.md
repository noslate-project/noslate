# Outbound Service Proxy
The runtime [Aworker](/docs/noslate_workers/design/aworker/intro) has limited file I/O and network I/O capabilities and therefore cannot access external services. In order to solve this problem, the outbound service proxy capability is added to Data Plane. In order to make it easier to understand, the Dapr calling format is selected as a reference, and the corresponding interface is designed.

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
Also, when exporting modules, use the CommonJS format:
```
module.exports = class DaprAdaptor {};
```

If necessary, you can refer to the document [Custom Outbound Service Proxy](noslate_workers/tutorials/custom_outbound.md) to implement the required Outbound Service Proxy.

When using, you need to pass the proxy module address into Data Plane through SDK, and Data Plane will initialize the instance.

```
// set DaprAdaptor
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;
const agent = new NoslatedClient();

await agent.setDaprAdaptor(modulePath);

// When initialized, the logger implementation will be passed in
const Clz = require(modulePath);
const adapter = new Clz(logger);

await adapter.ready();
```