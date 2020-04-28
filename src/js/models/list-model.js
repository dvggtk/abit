const debug = require("debug")("abit:list-model");

import AbstractModel from "./abstract-model";
import {clone, ModelItemMode} from "../utils";

const nop = () => {};

class Item {
  constructor({listModel, mode, data}) {
    if (!Object.values(ModelItemMode).includes(mode)) {
      throw Error();
    }
    this._listModel = listModel;

    this._isActive = false;
    this._mode = mode;
    this._data = data;
  }

  _deleteSelf() {
    this._listModel._items = this._listModel._items.filter(
      (item) => item !== this
    );
  }

  set mode(newMode) {
    if (!Object.values(ModelItemMode).includes(newMode)) {
      throw Error();
    }

    this._listModel._items.forEach((item) => {
      if (item._mode === ModelItemMode.ADD) {
        item._deleteSelf();
      } else if (item._mode === ModelItemMode.EDIT) {
        item._mode = ModelItemMode.VIEW;
      }
    });

    this._mode = newMode;
    this._listModel.onItemChangeMode(this);
    this._listModel.onChangeView();
  }
  get mode() {
    return this._mode;
  }

  setData(newData, callback) {
    const oldData = this._data;

    this._data = newData;
  }
  get data() {
    return this._data;
  }

  set isActive(newState) {
    if (typeof newState !== `boolean`) {
      throw Error();
    }
    this._listModel._items.forEach((item) => {
      item._isActive = false;
    });

    this._isActive = newState;

    this._listModel.onChangeView();
  }
  get isActive() {
    return this._isActive;
  }

  cancelEdit() {
    if (this._mode === ModelItemMode.ADD) {
      this._deleteSelf();
    } else {
      this._mode = ModelItemMode.VIEW;
    }

    this._listModel.onChangeView();
  }

  submit(newData, callback) {
    let newDataWithTypeIfExists;
    if (this._listModel._type !== null) {
      newDataWithTypeIfExists = Object.assign(
        {type: this._listModel._type},
        newData
      );
    } else {
      newDataWithTypeIfExists = newData;
    }

    if (this._mode === ModelItemMode.EDIT) {
      this._listModel._api.update(
        this._data,
        newDataWithTypeIfExists,
        (err, res) => {
          if (err) return callback(err);

          this._data = res;
          this._mode = ModelItemMode.VIEW;

          this._listModel.onChangeView();
          callback(null);
        }
      );
    } else if (this._mode === ModelItemMode.ADD) {
      this._listModel._api.create(newDataWithTypeIfExists, (err, res) => {
        if (err) return callback(err);

        this._data = res;
        this._mode = ModelItemMode.VIEW;

        this._listModel.onChangeView();
        callback(null);
      });
    }
  }

  clone() {
    this._listModel._items.forEach((item) => {
      item._mode = ModelItemMode.VIEW;
    });

    const idx = this._listModel._items.findIndex((item) => this === item);
    const data = this._data;
    this._listModel.createItem(data, idx + 1);

    this._listModel.onChangeView();
  }

  delete(callback) {
    this._listModel._api.delete(this._data, (err) => {
      if (err) return callback(err);

      this._deleteSelf();

      this._listModel.onChangeView();
      callback(null);
    });
  }
}

class ListModel extends AbstractModel {
  constructor(defalutItemData, api) {
    super();

    this._defaultItemData = defalutItemData;
    this._api = api;

    this.onItemChangeMode = nop;
    this.onChangeView = nop;

    this._items = [];

    this.type = null;
  }

  get items() {
    return this._items;
  }

  init(callback) {
    throw Error(`abstarct method invoked`);
  }

  bulkCreate(itemDataArray) {
    if (itemDataArray.length > 0) {
      this._items = itemDataArray.map((el) => {
        const data = clone(el);
        if (this._type !== null) {
          data.type = this._type;
        }
        return new Item({
          listModel: this,
          mode: ModelItemMode.VIEW,
          data
        });
      });
      this._currenItemIdx = 0;
    }
  }

  createItem(newData, newIdx) {
    const idx = newIdx === null ? 0 : newIdx;

    const data = newData ? clone(newData) : clone(this._defaultItemData);
    if (this._type !== null) {
      data.type = this._type;
    }
    const newItem = new Item({listModel: this, mode: ModelItemMode.ADD, data});

    this._items.splice(idx, 0, newItem);

    return newItem;
  }
}

export default ListModel;
