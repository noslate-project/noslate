const express = require('express');
const { join } = require('path');
const { Sequelize, Model, DataTypes } = require('sequelize');
const NoslatedClient = require(process.env.NOSLATE_PATH).NoslatedClient;

class FunctionProfile extends Model {}
class ServiceProfile extends Model {}

module.exports = class Gateway {
  static PORT = 9000;
  
  db;
  app;
  agent;
  
  constructor() {
    this.db = new Sequelize({
      dialect: 'sqlite',
      storage: join(__dirname, 'gateway.db')
    });

    FunctionProfile.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      codeInfo: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      namespace: {
        type: DataTypes.STRING(50)
      },
      workerConfig: {
        type: DataTypes.TEXT
      },
      environments: {
        type: DataTypes.TEXT
      },
      resourceLimit: {
        type: DataTypes.TEXT
      },
      rateLimit: {
        type: DataTypes.TEXT
      }
    }, {
      sequelize: this.db,
      tableName: 'function_profile',
      timestamps: true
    });

    ServiceProfile.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      selectors: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      sequelize: this.db,
      tableName: 'service_profile',
      timestamps: true
    });
    
    const app = express();

    app.use(express.json());
    
    app.get('/', this.indexHandler);
    app.post('/invoke', this.invokeHandler);
    app.post('/addFunction', this.addFunction);
    app.post('/addService', this.addService);
    app.get('/listFunction', this.listFunction);
    app.get('/listService', this.listService);
    app.post('/removeFunction', this.removeFunction);
    app.post('/removeService', this.removeService);
    
    this.app = app;
    
    this.client = new NoslatedClient();
  }
  
  async start() {
    await this.client.start();

    await this.updateFunctionProfiles();
    await this.updateServiceProfiles();

    console.log('Load profiles from db succeed');
    
    this.app.listen(Gateway.PORT, () => {
      console.log(`Gateway listening at ${Gateway.PORT}.`);
    });
  }

  indexHandler = (req, res) => {
    res.send('Hello, Noslate Workers.\n');
  }
  
  invokeHandler = (req, res) => {
    const headerTarget = req.headers['x-noslated-dispatch'];

    if (!headerTarget) {
      res.status(404).end();
    }

    const invokeTarget = this.getInvokeTarget(headerTarget);

    this.invoke(invokeTarget, req, res);
  }
  
  addFunction = async (req, res) => {
    const body = req.body;

    let codeInfo = {
      url: body.url,
      signature: body.signature,
      runtime: body.runtime
    };

    if (body.runtime === 'aworker') {
      codeInfo.sourceFile = body.sourceFile;
    } else {
      codeInfo.handler = body.handler;
      codeInfo.initializer = body.initializer;
    }

    const exist = await FunctionProfile.findOne({
      where: {
        name: body.name
      }
    });

    if (exist) {
      res.status(500).send('Function already exist.\n');
      return;
    }

    const functionProfile = FunctionProfile.build({
      name: body.name,
      codeInfo: JSON.stringify(codeInfo),
      namespace: body.namespace,
      workerConfig: JSON.stringify(body.workerConfig),
      environments: JSON.stringify(body.environments),
      resourceLimit: JSON.stringify(body.resourceLimit),
      rateLimit: JSON.stringify(body.rateLimit)
    });

    await functionProfile.save();

    await this.updateFunctionProfiles();

    res.send('succeed');
  }
  
  addService = async (req, res) => {
    const body = req.body;

    const exist = await ServiceProfile.findOne({
      where: {
        name: body.name
      }
    });

    if (exist) {
      res.status(500).send('Service already exist.\n');
      return;
    }

    const serviceProfile = await ServiceProfile.build({
      name: body.name,
      type: body.type,
      selectors: JSON.stringify(body.selectors)
    });

    await serviceProfile.save();

    await this.updateServiceProfiles();

    res.send('succeed');
  }
  
  removeFunction = async (req, res) => {
    const body = req.body;

    const ins = await FunctionProfile.findByPk(body.id);

    if (!ins) {
      res.status(404).send('Function not found.\n');
    }

    await ins.destroy();

    await this.updateFunctionProfiles();

    res.send('succeed');
  }
  
  removeService = async (req, res) => {
    const body = req.body;

    const ins = await ServiceProfile.findByPk(body.id);

    if (!ins) {
      res.status(404).send('Service not found.\n');
    }

    await ins.destroy();

    await this.updateServiceProfiles();

    res.send('succeed');
  }
  
  listFunction = async (req, res) => {
    const data = await FunctionProfile.findAndCountAll({
      raw: true
    });

    res.send(data);
  }
  
  listService = async (req, res) => {
    const data = await ServiceProfile.findAndCountAll({
      raw: true
    });

    res.send(data);
  }

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

  getInvokeTarget(headerTarget) {
    const target = headerTarget.split(':');
    let type = target[0];
    let alias = target[1];

    // 不指定类型则默认执行 function
    if (!alias) {
      return {
        type: 'function',
        alias: type
      };
    }

    return {
      type,
      alias
    };
  }
}

function objectToArray(obj) {

  return Object.keys(obj).reduce((result, key) => {
    const val = obj[key];

    if (val !== undefined && val !== null) {
      result.push([key, String(val)]);
    }

    return result;
  }, []);
}