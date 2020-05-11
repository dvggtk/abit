const debug = require("debug")("abit:abstract-list-controller");

import {
  render,
  unrender,
  Position,
  Key,
  ModelItemMode,
  ShowMode,
  toCamelCase,
  clone
} from "../utils";

class ListController {
  constructor(container, model, ListComponent, ItemController) {
    debug(`constructor`);
    this._container = container;

    this._ListComponent = ListComponent;
    this._ItemController = ItemController;

    this._listComponent = new this._ListComponent();

    this._model = model;

    this._itemControllers = [];
  }

  _refreshListItems(items) {
    if (!items) throw Error();

    const refreshItem = (item) => {
      const foundItemController = this._itemControllers.find(
        (itemController) => itemController.item === item
      );

      if (!foundItemController) {
        const itemController = this._renderItem(item);
        itemController.refresh();
        return;
      }

      foundItemController.refresh();
    };

    if (Array.isArray(items)) {
      items.forEach(refreshItem);
    } else {
      refreshItem(items);
    }
  }

  init() {
    debug(`init`);
    this._renderList();

    this._model.onChangeView = (items) => {
      debug(`_model.onChangeView`);

      if (!items) {
        this._renderList();
        return;
      }

      this._refreshListItems(items);
    };

    this._model.onItemChangeMode = (items) => {
      debug(`_model.onItemChangeMode items: %O`, items);
      this._refreshListItems(items);
    };
  }

  bind() {
    const btnAddElement = this._listComponent
      .getElement()
      .querySelector(`.list-btn-add`);

    btnAddElement.addEventListener(`click`, (event) => {
      debug(`list-btn-add`);
      this._model.createItem();
    });
  }

  _renderList() {
    unrender(this._listComponent.getElement());
    this._listComponent.removeElement();

    this.bind();

    render(
      this._container,
      this._listComponent.getElement(),
      Position.BEFOREEND
    );
    this._itemControllers = [];

    this._model.items.forEach((item) => this._renderItem(item));
  }

  _renderItem(item) {
    debug(`_renderItem, this._ListComponent %O`, this._listComponent);

    let listElement = this._listComponent.getElement();
    if (!listElement.classList.contains(`list`)) {
      listElement = listElement.querySelector(`.list`);
    }

    const itemController = new this._ItemController(
      this,
      listElement,
      item,
      null,
      null
    );

    this._itemControllers.push(itemController);

    return itemController;
  }
}

export default ListController;
