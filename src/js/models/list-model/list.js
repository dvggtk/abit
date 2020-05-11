const debug = require("debug")("abit:list-model/list");

import AbstractModel from "../abstract-model";
import {clone, ModelItemMode} from "../../utils";
import Item from "./item";

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

    this._filterFn = (item) => true;

    this._isItemVisible = this._isItemVisible.bind(this);
  }

  get items() {
    debug(
      `get items, _filterFn(_items[0]): %O`,
      this._filterFn(this._items[0])
    );
    return this._items.filter(this._isItemVisible);
  }

  _isItemVisible(item) {
    return item._mode === ModelItemMode.ADD || this._filterFn(item);
  }

  set filterFn(fn) {
    debug(`set filterFn`);

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
    const idx = !newIdx ? 0 : newIdx;

    const data = newData ? clone(newData) : clone(this._defaultItemData);
    if (this._type !== null) {
      data.type = this._type;
    }

    const changedModeItems = [];
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
