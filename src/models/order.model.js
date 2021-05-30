const db = require('../utils/db');

module.exports = {
  async add(order) {
    const [result, fields] = await db.add(order, 'orders');
    return result;
  }
};