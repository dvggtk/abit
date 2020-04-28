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

  init() {
    debug(`init`);
    this._renderAbitsList();

    this._model.onChangeView = () => {
      debug(`_model.onChangeView`);
      this._renderAbitsList();
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
  }
}

export default AbitsListController;
