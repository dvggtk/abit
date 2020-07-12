/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import PouchDB from "pouchdb";
import {
  diff
  // addedDiff,
  // deletedDiff,
  // updatedDiff,
  // detailedDiff
} from "deep-object-diff";
import AbstractApi from "./abstract-api";
import {eduProgs, getAbits} from "../data";

const debug = require("debug")("abit:pouchdb-api");

const createEduProgsView = (db) => {
  debug(`createEduProgsView`);
  // eslint-disable-next-line no-shadow
  const eduProgs = {
    _id: "_design/eduProgs",
    views: {
      eduProgs: {
        map: function mapFun(doc) {
          if (doc.type === `edu-prog`) {
            // eslint-disable-next-line no-undef
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
            // eslint-disable-next-line no-undef
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

  clear(callback) {
    (async () => {
      debug(`clear`);

      await this._db.destroy();
      this._db = new PouchDB(`abit`);

      callback(null);
    })().catch((error) => callback(error));
  }

  init(callback) {
    debug(`init`);

    (async () => {
      this._db = new PouchDB(`abit`);

      const retrySync = window.location.hostname !== `localhost`;
      const remoteDbUrl = `${window.location.origin}/db`;
      // eslint-disable-next-line no-unused-vars
      const sync = PouchDB.sync("abit", `${remoteDbUrl}/abit`, {
        live: true,
        retry: retrySync
      })
        .on("change", (info) => {
          // handle change
          console.log(`sync change`, info);
        })
        .on("paused", (err) => {
          if (err) console.error(err.message);
          // replication paused (e.g. replication up to date, user went offline)
        })
        .on("active", () => {
          // replicate resumed (e.g. new changes replicating, user went back online)
        })
        .on("denied", (err) => {
          if (err) console.error(err.message);
          // a document failed to replicate (e.g. due to permissions)
        })
        .on("complete", (info) => {
          console.log("sync complete", info);
          // handle complete
        })
        .on("error", (err) => {
          if (err) console.error(err);
          // handle error
        });

      const info = await this._db.info();
      debug(`db.info %o`, info);

      if (info.doc_count === 0) {
        debug(`пустая база данных, создаю view`);
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
    })().catch((error) => callback(error));
  }

  create(newData, callback) {
    debug(`create %O`, newData);
    this._db.post(newData, (err, res) => {
      if (err) return callback(err);

      const data = Object.assign(newData, {_id: res.id, _rev: res.rev});
      return callback(null, data);
    });
  }

  update(oldData, newData, callback) {
    this._db.put(
      {_id: oldData._id, _rev: oldData._rev, ...newData},
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

      return callback(null, res);
    });
  }

  backup(callback) {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const sanitizeDoc = (doc) => {
      const newDoc = Object.create(null);
      // eslint-disable-next-line no-restricted-syntax
      for (const k in doc) {
        // eslint-disable-next-line no-prototype-builtins
        if (doc.hasOwnProperty(k)) {
          // eslint-disable-next-line no-continue
          if (k === `_rev`) continue;
          newDoc[k] = doc[k];
        }
      }
      return newDoc;
    };

    (async () => {
      // eslint-disable-next-line no-shadow
      const eduProgs = (
        await this._db.query(`eduProgs`, {include_docs: true})
      ).rows.map((row) => sanitizeDoc(row.doc));

      const abits = (
        await this._db.query(`abits`, {include_docs: true})
      ).rows.map((row) => sanitizeDoc(row.doc));

      callback(null, {eduProgs, abits});
    })().catch((error) => callback(error));
  }

  getEduProgs(callback) {
    this._db.query(`eduProgs`, {include_docs: true}, (err, res) => {
      debug(`getEduProgs: \n%o \n%o`, err, res);
      if (err) return callback(err);

      // eslint-disable-next-line no-shadow
      const eduProgs = res.rows.map((row) => row.doc);
      return callback(null, eduProgs);
    });
  }

  getAbits(callback) {
    this._db.query(`abits`, {include_docs: true}, (err, res) => {
      debug(`abits: \n%o \n%o`, err, res);
      if (err) return callback(err);

      const abits = res.rows.map((row) => row.doc);
      return callback(null, abits);
    });
  }

  addFakeAbits(count, callback) {
    (async () => {
      const abits = getAbits(count).map((el) => ({type: `abit`, ...el}));

      await this._db.bulkDocs(abits);

      callback(null);
    })().catch((error) => callback(error));
  }

  addFakeEduProgs(callback) {
    (async () => {
      await this._db.bulkDocs(
        eduProgs.map((el) => ({type: `edu-prog`, ...el}))
      );

      callback(null);
    })().catch((error) => callback(error));
  }
}

const pouchDBApi = new PouchDBApi();

export default pouchDBApi;
