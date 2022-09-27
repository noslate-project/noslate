# Gateway
主要用于完成和外部流量入口的对接，配合 [SDK](noslate_workers/references/sdk.md) 一起实现对 Noslate 的调用。

## 转换请求格式
Gateway 需要将外部流量的格式转换成 Data Panel 可用的格式：
1. 函数/服务识别名称
2. Buffer/Readable Stream 调用数据
3. Metadata 信息，包含：url、method、headers、baggage，timeout，requestId 等

针对不同的请求形式，需要做不同的转换：

#### HTTP 请求
可以在请求头中获取具体要函数/服务调用名称，将请求 url、method、headers 等信息转换成 Metadata 形式，将请求 body 作为数据传入，如：
```
curl -X POST http://127.0.0.1/invoke -H "trace-id: 1000" -H "noslate-target:service|a" -d "ok"
```
转换成
```
await invokeService("a", Buffer.from("ok"), {
    url: "/invoke"
    headers: [
        ["trace-id", "1000"]
    ]
});
```

#### Event 请求
可以将具体要函数/服务调用名称放在调用参数中，或者请求本身的元信息中。而 Metadata 所需的信息，可以根据实际情况映射或者以常量替代，如：
```
// 定时触发器
{
    "triggerTime":"2018-02-09T05:49:00Z",
    "triggerName":"timer-trigger",
    "payload":"function:awesome-fc,ok"
}            
```
转换成
```
await invoke("awesome-fc", Buffer.from("ok"), {
    url: "/timer-trigger"
    headers: [
        ["triggerTime", "2018-02-09T05:49:00Z"]
    ]
});
```

## 调用并处理响应数据
通过 [SDK](noslate_workers/references/sdk.md) 暴露的 invoke/invokeService 接口执行具体函数。

```
const response = await agent.invoke(name, data, metadata);
const response = await agent.invokeService(name, data, metadata);
```

invoke/invokeService 接口返回为流的形式，可以直接 pipe 到响应流中，如：HTTP Response。如需要获取 Buffer 形式的数据，可以参考：
```
async function bufferFromStream(stream: Readable): Promise<Buffer> {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

await bufferFromStream(response);
```

## 更新函数/服务路由配置
Gateway 除了需要处理请求的进出，还需要将函数/服务路由配置及时更新到 [Alice](noslate_workers/design/alice/intro) 中：
```
await agent.setFunctionProfile(config);
await agent.setServiceProfile(config);
```
配置内容可可以存放在本地文件中，也可以对接到各种配置管理系统。

如需，可以参考文档[自定义 Gateway](noslate_workers/tutorials/custom_baas.md)来自定义 Gateway 模块。