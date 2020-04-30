const debug = require("debug")("abit:pouchdb-api");

import AbstractApi from "./abstract-api";
import PouchDB from "pouchdb";
import {eduProgs, getAbits} from "../data";
import {
  diff,
  addedDiff,
  deletedDiff,
  updatedDiff,
  detailedDiff
} from "deep-object-diff";

const getDefaultDocs = () => {
  let defaultDocs = [];
  defaultDocs = defaultDocs.concat(
    eduProgs.map((el) => Object.assign({type: `edu-prog`}, el))
  );
  defaultDocs = defaultDocs.concat(
    getAbits(5).map((el) => Object.assign({type: `abit`}, el))
  );

  return defaultDocs;
};

const createEduProgsView = (db) => {
  debug(`createEduProgsView`);
  const eduProgs = {
    _id: "_design/eduProgs",
    views: {
      eduProgs: {
        map: function mapFun(doc) {
          if (doc.type === `edu-prog`) {
            emit(doc.code, null);
          }
        }.toString()
      }
    }
  };

  return db.put(eduProgs);
};

const createAbitsView = (db) => {
  debug(`createAbitsView`);
  const abits = {
    _id: "_design/abits",
    views: {
      abits: {
        map: function mapFun(doc) {
          if (doc.type === `abit`) {
            emit(doc.fio, null);
          }
        }.toString()
      }
    }
  };

  return db.put(abits);
};

class PouchDBApi extends AbstractApi {
  constructor() {
    super();
    debug(`constructor PouchDBApi`);
  }

  init(callback) {
    debug(`init`);

    (async () => {
      {
        this._db = new PouchDB(`abit`);

        // await this._db.destroy();
        // this._db = new PouchDB(`abit`);

        const info = await this._db.info();
        debug(`db.info %o`, info);

        if (info.doc_count === 0) {
          debug(`пустая база данных, загружаю данные по умолчанию`);
          await this._db.bulkDocs(getDefaultDocs());
          await Promise.all([
            createAbitsView(this._db),
            createEduProgsView(this._db)
          ]);
        }

        debug(
          `await eduProgs: %o`,
          await this._db.query(`eduProgs`, {include_docs: true})
        );

        debug("abits: %o", await this._db.query(`abits`, {include_docs: true}));

        callback(null);
      }
    })().catch((err) => callback(err));
  }

  create(newData, callback) {
    debug(`create %O`, newData);
    this._db.post(newData, (err, res) => {
      if (err) return callback(err);

      const data = Object.assign(newData, {_id: res.id, _rev: res.rev});
      callback(null, data);
    });
  }
  update(oldData, newData, callback) {
    this._db.put(
      Object.assign({_id: oldData._id, _rev: oldData._rev}, newData),
      (err, res) => {
        if (err) return callback(err);

        const data = Object.assign(newData, {_id: res.id, _rev: res.rev});

        debug(
          `update \noldData:%O \nnewData: %O \n diff: %o`,
          oldData,
          data,
          diff(oldData, data)
        );

        return callback(null, data);
      }
    );
  }
  delete(oldData, callback) {
    debug(`delete %O`, oldData);

    this._db.remove(oldData, (err, res) => {
      if (err) return callback(err);

      callback(null, res);
    });
  }

  getEduProgs(callback) {
    this._db.query(`eduProgs`, {include_docs: true}, function (err, res) {
      debug(`getEduProgs: \n%o \n%o`, err, res);
      if (err) return callback(err);

      const eduProgs = res.rows.map((row) => row.doc);
      callback(null, eduProgs);
    });
  }

  getAbits(callback) {
    this._db.query(`abits`, {include_docs: true}, function (err, res) {
      debug(`abits: \n%o \n%o`, err, res);
      if (err) return callback(err);

      const abits = res.rows.map((row) => row.doc);
      callback(null, abits);
    });
  }
}

export default PouchDBApi;
