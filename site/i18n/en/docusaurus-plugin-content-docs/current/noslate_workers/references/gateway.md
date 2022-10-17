# Gateway
It is mainly used to complete the docking with the external traffic portal, and realize the call to Noslate together with the [SDK](noslate_workers/references/sdk.md).

## Convert Request Format
The Gateway needs to convert the format of the external traffic into a format usable by Data Plane:

1. Function/Service Distinguished Name
2. Buffer/Readable Stream call data
3. Metadata information, including: url, method, headers, baggage, timeout, requestId, etc.
For different request forms, different conversions need to be done:

#### HTTP Request
You can get the name of the specific Worker function/service call in the request header, convert the request url, method, headers and other information into Metadata form, and pass in the request body as data, such as:
```
curl -X POST http://127.0.0.1/invoke -H "trace-id: 1000" -H "noslate-target:service|a" -d "ok"
```
Convert to
```
await invokeService("a", Buffer.from("ok"), {
    url: "/invoke"
    headers: [
        ["trace-id", "1000"]
    ]
});
```

#### Event Request
You can put the name of the specific Worker function/service invocation in the invocation parameters, or in the meta information of the request itself. The information required by Metadata can be mapped according to the actual situation or replaced by constants, such as:
```
// timed trigger
{
    "triggerTime":"2018-02-09T05:49:00Z",
    "triggerName":"timer-trigger",
    "payload":"function:awesome-fc,ok"
}            
```
convert to
```
await invoke("awesome-fc", Buffer.from("ok"), {
    url: "/timer-trigger"
    headers: [
        ["triggerTime", "2018-02-09T05:49:00Z"]
    ]
});
```

## Call and process the response data
Execute specific Worker functions through the invoke/invokeService interface exposed by [SDK](noslate_workers/references/sdk.md).

```
const response = await agent.invoke(name, data, metadata);
const response = await agent.invokeService(name, data, metadata);
```

The invoke/invokeService interface is returned in the form of a stream, which can be directly piped into the response stream, such as HTTP Response. If you need to get the data in the form of Buffer, you can refer to:
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

## Update Worker Function/Service Routing Configuration
In addition to processing the incoming and outgoing requests, the Gateway also needs to update the Worker function/service routing configuration to [Noslated](noslate_workers/noslated/intro) in time:
```
await agent.setFunctionProfile(config);
await agent.setServiceProfile(config);
```
The configuration content can be stored in local files or connected to various configuration management systems.

If necessary, you can refer to the document [Custom Gateway](noslate_workers/tutorials/custom_gateway.md) to customize the Gateway module.