import ListModel from "./list-model";

const debug = require("debug")("abit:abits-model");

class AbitsModel extends ListModel {
  constructor(api) {
    const defaultAbitData = {
      fio: ``,
      gender: ``,
      regDate: ``,
      certScore: ``,
      extraScore: ``,
      totalScore: ``,
      hasCertOriginal: false,
      hasMedicalCert: false,
      hasFluoro: false,
      hasVaccine: false,
      needDorm: 0,
      school: ``,
      schoolYear: `2020`,
      address: ``,
      tel: ``,
      memo: ``,
      applications: []
    };

    super(defaultAbitData, api);
    this._type = `abit`;
  }

  init(callback) {
    debug(`init`);
    this._api.getAbits((err, res) => {
      if (err) return callback(err);

      this.bulkCreate(res);
      return callback(null, res);
    });
  }
}

export default AbitsModel;
