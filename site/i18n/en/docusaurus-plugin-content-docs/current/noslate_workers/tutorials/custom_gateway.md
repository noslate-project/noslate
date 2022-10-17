# Custom Gateway

Following this tutorial, we will implement a custom Gateway module based on HTTP, and can store Worker function information persistently through sqllite.

## Data storage
In this example, we choose sqlite3 as the storage, first create a database:
```
> sqlite3 gateway.db
```
Then we create two tables to store Worker function configuration and service routing configuration:
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
In this example, we choose expressjs as the HTTP server framework.
```
> npm install express --save
```

gateway provides the following routes:
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

Then we initialize sqllite db and noslated client.

```
// init db
this.db = new Sequelize({
  dialect: 'sqlite',
  storage: './gateway.db'
});

// init agent
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;
this.agent = new NoslatedClient();

await this.agent.start();
```

### /invoke
Forwarding the request to Noslate and executing it is the core capability of the entire Gateway, so let's look at the implementation of this part first.

In the current gateway implementation, we agree that the specific call target is passed in with the query parameter target, the format is -- **target type|target name**, and the target type value is function or service.

Here, take HTTP Server as an example to introduce how to implement a custom Gateway module:

#### 1. Create a HTTP Server
```
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});

server.listen(8000);
```

#### 2. Create Agent object and initialize
```
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;
const client = new NoslatedClient();

await client.start();
```

### 3. Parse the HTTP request and forward it
```
// The call target is specified by the x-noslate-target in the request header
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

### 4. Support update configuration
Subscribe to remote Worker function configuration and update
```
setInterval(async () => {
    const config = await fetch(configUrl);

    await agent.setFunctionProfile(url);
}, 60 * 1000);
```