# Customize Outbound service proxy

In this section, take the access database proxy as an example to introduce how to implement a custom proxy service:

Take the example of offering to find products by product ID

```
const sequelize = require('sequelize');
// The form of require(modulePath) is used when loading, so it must be exported based on the commonJS specification
module.exports = class DaprProvider {
  // Initialization method to ensure the agent is running and serviceable
  async ready() {
    const { Sequelize } = require('sequelize');

    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'host.to.mysql',
        port: 3306,
        username: 'xxx',
        password: 'xxx'
    });

    await sequelize.auth();
  }
  // Close method, used to recycle resources
  async close() {}
	/**
   * Optionally implement the invoke interface. For details, please refer to the dapr protocol definition:
   * @see: https://docs.dapr.io/reference/api/service_invocation_api/
   * @param {DaprInvokeOptions} options
   *  - @property {string} app
   *  - @property {string} methodName
   *  - @property {Buffer} data
   * @returns {Promise<DaprResponse>}
   *  - @property {number} status
   *  - @property {Buffer} data
   */
 	async invoke(options) {}
  /**
   * Optionally implement the bingding interface. For details, please refer to the dapr protocol definition:
   * @see: https://docs.dapr.io/reference/api/service_invocation_api/
   * @param {DaprBindingOptions} options
   *  - @property {string} name
   *  - @property {string} metadata
   *  - @property {string} operation
   *  - @property {Buffer} data
   * @returns {Promise<DaprResponse>}
   *  - @property {number} status
   *  - @property {Buffer} data
   */
  async binding(options) {
    if (name === 'queryById') {
        const result = await sequelize.query(`select * from product where id=${options.data}`);

        return {
            statu: 200,
            data: result
        }
    }

    return {
        status: 404,
        data: 'Not Found'
    };
  }
}
```