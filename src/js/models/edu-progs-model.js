import ListModel from "./list-model";

const debug = require("debug")("abit:edu-progs-model");

class EduProgsModel extends ListModel {
  constructor(api) {
    const defaultEduProgData = {
      code: ``,
      speciality: ``,
      qualification: ``,
      eduForm: `очная`,
      baseEduLevel: `11 классов`,
      duration: `1 год 10 месяцев`,
      finSource: `бюджет`,
      placesNumber: ``
    };

    super(defaultEduProgData, api);
    this._type = `edu-prog`;
  }

  init(callback) {
    debug(`init`);
    this._api.getEduProgs((err, res) => {
      if (err) return callback(err);

      this.bulkCreate(res);
      return callback(null, res);
    });
  }
}

export default EduProgsModel;
