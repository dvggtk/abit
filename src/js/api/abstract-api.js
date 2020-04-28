const debug = require("debug")("abit:api");

class AbstractApi {
  constructor() {
    debug(`constructor AbstractApi`);
  }

  init(callback) {
    debug(`init`);
    callback(null);
  }

  create(newData, callback) {
    debug(`create`);
    return callback(null, newData);
  }
  update(oldData, newData, callback) {
    debug(`update`);
    return callback(null, newData);
  }
  delete(oldData, callback) {
    debug(`delete`);
    return callback(null);
  }
}

export default AbstractApi;
