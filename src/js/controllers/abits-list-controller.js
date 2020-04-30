const debug = require("debug")("abit:abits-list-controller");

import AbitsList from "../components/abits-list";
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
import AbitController from "../controllers/abit-controller";

class AbitsListController {
  constructor(container, model) {
    debug(`constructor`);
    this._container = container;
    this._abitsList = new AbitsList();

    this._model = model;

    this._abitControllers = [];
  }

  _refreshListItems(items) {
    if (!items) throw Error();

    const refreshItem = (item) => {
      const foundAbitController = this._abitControllers.find(
        (abitController) => abitController.item === item
      );

      if (!foundAbitController) {
        const abitController = this._renderAbit(item);
        abitController.refresh();
        return;
      }

      foundAbitController.refresh();
    };

    if (Array.isArray(items)) {
      items.forEach(refreshItem);
    } else {
      refreshItem(items);
    }
  }

  init() {
    debug(`init`);
    this._renderAbitsList();

    this._model.onChangeView = (items) => {
      debug(`_model.onChangeView`);

      if (!items) {
        this._renderAbitsList();
        return;
      }

      this._refreshListItems(items);
    };

    this._model.onItemChangeMode = (items) => {
      debug(`_model.onItemChangeMode items: %O`, items);
      this._refreshListItems(items);
    };
  }

  _renderAbitsList() {
    unrender(this._abitsList.getElement());
    this._abitsList.removeElement();

    render(this._container, this._abitsList.getElement(), Position.BEFOREEND);
    this._abitControllers = [];

    this._model.items.forEach((item) => this._renderAbit(item));
  }

  _renderAbit(item) {
    const abitController = new AbitController(
      this._abitsList.getElement(),
      item
    );

    this._abitControllers.push(abitController);

    return abitController;
  }
}

export default AbitsListController;
