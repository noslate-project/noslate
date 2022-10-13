const { join } = require('path');
const { Sequelize, QueryTypes } = require('sequelize');

module.exports = class OutboundProxy {
  db;
  logger;

  constructor({ logger }) {
    this.logger = logger;
  }

  async ready() {
    this.db = new Sequelize({
      dialect: 'sqlite',
      storage: join(__dirname, 'demo.db'),
      logging: this.logger.info
    });
  }

  async close() {}

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

  async listStock(page, pageSize, count) {
    try {
      page = parseInt(page, 10);
      pageSize = parseInt(pageSize, 10);
      count = parseInt(count, 10);

      const result = await this.db.query('select * from product where amount >= :amount limit :offset, :limit', {
        replacements: {
          amount: count,
          offset: (page - 1) * pageSize,
          limit: pageSize
        },
        type: QueryTypes.SELECT
      });

      return {
        status: 200,
        data: Buffer.from(JSON.stringify(result))
      };
    } catch (error) {
      return {
        status: 500,
        data: Buffer.from(error.message)
      };
    }
  }

  async findByName(name) {
    try {
      const result = await this.db.query(`select * from product where name like :search_name;`, {
        replacements: {
          search_name: `%${name}%`
        },
        type: QueryTypes.SELECT
      });
  
      return {
        status: 200,
        data: Buffer.from(JSON.stringify(result))
      };
    } catch (error) {
      return {
        status: 500,
        data: Buffer.from(error.message)
      };
    }
  }
}