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
  }

  get items() {
    debug(
      `get items, _filterFn(_items[0]): %O`,
      this._filterFn(this._items[0])
    );
    return this._items.filter(this._filterFn);
  }

  set filterFn(fn) {
    debug(`set filterFn`);
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
