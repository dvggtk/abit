import AbstractApi from "./abstract-api";

class EduProgApi extends AbstractApi {
  constructor() {
    super();
  }

  create(newData, callback) {
    return callback(null, newData);
  }
  update(oldData, newData, callback) {
    return callback(null, newData);
  }
  delete(oldData, callback) {
    return callback(null);
  }
}

export default EduProgApi;
