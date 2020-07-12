import {ModelItemMode} from "../../utils";

const debug = require("debug")("abit:list-model/item");

class Item {
  constructor({listModel, mode, data}) {
    if (!Object.values(ModelItemMode).includes(mode)) {
      throw new Error("Halt");
    }
    this._listModel = listModel;

    this._isActive = false;
    this._mode = mode;
    this._data = data;

    this._timestamp = performance.now();
  }

  _deleteSelf() {
    this._listModel._items = this._listModel._items.filter(
      (item) => item !== this
    );
    this._deleted = true;
  }

  get index() {
    // именно .items, а не ._items
    return this._listModel.items.indexOf(this);
  }

  get deleted() {
    return Boolean(this._deleted);
  }

  get visible() {
    return this._listModel._isItemVisible(this);
  }

  set mode(newMode) {
    if (!Object.values(ModelItemMode).includes(newMode)) {
      throw new Error("Halt");
    }

    const itemsChangeMode = [];

    this._listModel._items.forEach((item) => {
      if (item._mode === ModelItemMode.ADD) {
        item._deleteSelf();
        itemsChangeMode.push(item);
      } else if (item._mode === ModelItemMode.EDIT) {
        // eslint-disable-next-line no-param-reassign
        item._mode = ModelItemMode.VIEW;
        itemsChangeMode.push(item);
      }
    });

    if (this._mode !== newMode) {
      this._mode = newMode;
      itemsChangeMode.push(this);
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const removeDuplicates = (a) => [...new Set(a)];

    if (itemsChangeMode.length > 0) {
      this._listModel.onItemChangeMode(removeDuplicates(itemsChangeMode));
    }
  }

  get mode() {
    return this._mode;
  }

  // eslint-disable-next-line no-unused-vars
  setData(newData, callback) {
    // eslint-disable-next-line no-unused-vars
    const oldData = this._data;

    this._data = newData;
  }

  get data() {
    return this._data;
  }

  set isActive(newState) {
    if (typeof newState !== `boolean`) {
      throw new TypeError("Halt");
    }

    // FIXME переделать, сейчас неправильно перерисовывает, не снимает метку активности
    this._listModel._items.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item._isActive = false;
    });

    this._isActive = newState;

    this._listModel.onChangeView(this);
  }

  get isActive() {
    return this._isActive;
  }

  cancelEdit() {
    if (this._mode === ModelItemMode.ADD) {
      this._deleteSelf();
      this._listModel.onChangeView(this);
      return;
    }

    this._mode = ModelItemMode.VIEW;
    this._listModel.onItemChangeMode(this);
  }

  submit(newData, callback) {
    let newDataWithTypeIfExists;
    if (this._listModel._type !== null) {
      newDataWithTypeIfExists = {
        type: this._listModel._type,
        ...newData
      };
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

          this._listModel.onChangeView(this);
          return callback(null);
        }
      );
    } else if (this._mode === ModelItemMode.ADD) {
      this._listModel._api.create(newDataWithTypeIfExists, (err, res) => {
        if (err) return callback(err);

        this._data = res;
        this._mode = ModelItemMode.VIEW;

        this._listModel.onChangeView(this);
        return callback(null);
      });
    }
  }

  clone() {
    debug(`clone, item %O`, this);
    const changedModeItems = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of this._listModel._items) {
      if (item._mode !== ModelItemMode.VIEW) {
        item._mode = ModelItemMode.VIEW;
        changedModeItems.push(item);
      }
    }
    this._listModel.onItemChangeMode(changedModeItems);

    const idx = this.index;
    const data = this._data;
    const newItem = this._listModel.createItem(data, idx + 1);

    this._listModel.onChangeView(newItem);
  }

  delete(callback) {
    debug(`delete item: %O`, this);
    this._listModel._api.delete(this._data, (err) => {
      if (err) return callback(err);

      this._deleteSelf();

      this._listModel.onChangeView(this);
      return callback(null);
    });
  }
}

export default Item;
