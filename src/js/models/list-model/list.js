import AbstractModel from "../abstract-model";
import {clone, ModelItemMode} from "../../utils";
import Item from "./item";

const debug = require("debug")("abit:list-model/list");

const nop = () => {};

class ListModel extends AbstractModel {
  constructor(defalutItemData, api) {
    debug(`constructor`);
    super();

    this._defaultItemData = defalutItemData;
    this._api = api;

    this.onItemChangeMode = nop;
    this.onChangeView = nop;

    this._items = [];

    this.type = null;

    // eslint-disable-next-line no-unused-vars
    this._filterFn = (item) => true;

    this._compareFn = (item1, item2) => item1._timestamp - item2._timestamp;

    this._isItemVisible = this._isItemVisible.bind(this);
  }

  get items() {
    debug(
      `get items, _filterFn(_items[0]): %O`,
      this._filterFn(this._items[0])
    );
    return this._items.filter((item) => this._isItemVisible(item));
  }

  _isItemVisible(item) {
    return item._mode === ModelItemMode.ADD || this._filterFn(item);
  }

  set filterFn(fn) {
    debug(`set filterFn`);

    // eslint-disable-next-line no-restricted-syntax
    for (const item of this._items) {
      if (item._mode === ModelItemMode.EDIT) {
        item._mode = ModelItemMode.VIEW;
      }
      if (item._mode === ModelItemMode.ADD) {
        item._deleteSelf();
      }
    }

    this._filterFn = fn;

    this.onChangeView(null);
  }

  set compareFn(fn) {
    debug(`set compareFn`);

    // eslint-disable-next-line no-restricted-syntax
    for (const item of this._items) {
      if (item._mode === ModelItemMode.EDIT) {
        item._mode = ModelItemMode.VIEW;
      }
      if (item._mode === ModelItemMode.ADD) {
        item._deleteSelf();
      }
    }

    this._compareFn = fn;

    this._items.sort(this._compareFn);

    this.onChangeView(null);
  }

  // eslint-disable-next-line class-methods-use-this
  init() {
    throw new Error(`abstarct method invoked`);
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

      this._items.sort(this._compareFn);

      this._currenItemIdx = 0;
    }
  }

  createItem(newData, newIdx) {
    const idx = !newIdx ? 0 : newIdx;

    const data = newData ? clone(newData) : clone(this._defaultItemData);
    if (this._type !== null) {
      data.type = this._type;
    }

    const changedModeItems = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this._items) {
      if (item._mode === ModelItemMode.EDIT) {
        item._mode = ModelItemMode.VIEW;
        changedModeItems.push(item);
      }
      if (item._mode === ModelItemMode.ADD) {
        item._deleteSelf();
        changedModeItems.push(item);
      }
    }
    this.onItemChangeMode(changedModeItems);

    const newItem = new Item({listModel: this, mode: ModelItemMode.ADD, data});

    this._items.splice(idx, 0, newItem);

    this.onChangeView(newItem);

    return newItem;
  }
}

export default ListModel;
