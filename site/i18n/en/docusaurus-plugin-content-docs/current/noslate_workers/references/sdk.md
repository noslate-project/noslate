# Noslated SDK
The [interface](/noslate_workers/api/sdk) provided by Noslate is used to connect to the Gateway implementation and can be introduced through NOSLATE_PATH.

```
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;

const client = new NoslatedClient();

await client.start();
```

