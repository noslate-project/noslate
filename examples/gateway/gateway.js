const express = require('express');
const { Sequelize } = require('sequelize');
const AliceAgent = require(process.env.NOSLATE_PATH).AliceAgent;

module.exports = class Gateway {
  static PORT = 9000;

  db;
  app;
  agent;

  constructor() {
    this.db = new Sequelize({
      dialect: 'sqlite',
      storage: './gateway.db'
    });

    const app = express();

    app.post('/invoke', this.invoke);
    app.post('/addFunction', this.addFunction);
    app.post('/addService', this.addService);
    app.get('/listFunction', this.listFunction);
    app.get('/listService', this.listService);
    app.post('/removeFunction', this.removeFunction);
    app.post('/removeService', this.removeService);

    this.app = app;

    this.agent = new AliceAgent();
  }

  async start() {
    await this.agent.start();

    this.app.listen(Gateway.PORT, () => {
      console.log(`Gateway listening at ${Gateway.PORT}.`);
    });
  }

  invoke = (req, res) => {

  }

  addFunction = (req, res) => {

  }

  addService = (req, res) => {

  }

  removeFunction = (req, res) => {

  }

  removeService = (req, res) => {

  }

  listFunction = (req, res) => {
    
  }

  listService = (req, res) => {
    
  }
}