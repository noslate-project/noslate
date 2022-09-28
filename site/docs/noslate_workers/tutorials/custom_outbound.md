# 自定义 Outbound 服务代理

在此，以访问数据库代理为例，介绍如何实现自定义代理服务：

以提供通过商品 ID 查找商品为例

```
const sequelize = require('sequelize');
// 加载时使用 require(modulePath) 的形式，所以必须基于 commonJS 规范导出
module.exports = class DaprProvider {
  // 确保代理运行并可服务的初始化方法
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
  // 关闭方法，用于回收资源
  async close() {}
	/**
   * 可选实现 invoke 接口，具体可参考 dapr 协议定义：
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
   * 可选实现 bingding 接口，具体可参考 dapr 协议定义：
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