# Noslated SDK
Noslated 对外提供的[接口](/noslate_workers/api/sdk)，用于对接 Gateway 实现，可以通过 NOSLATE_PATH 引入。

```
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;

const client = new NoslatedClient();

await client.start();
```

