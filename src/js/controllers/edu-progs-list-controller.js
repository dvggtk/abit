const debug = require("debug")("abit:edu-prog-list-controller");

import EduProgsList from "../components/edu-progs-list";
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
import EduProgController from "../controllers/edu-prog-controller";

class EduProgsListController {
  constructor(container, model) {
    debug(`constructor`);
    this._container = container;
    this._eduProgsList = new EduProgsList();

    this._eduProgControllers = [];

    this._changeViewSubscriptions = [];

    this._model = model;

    this._onEscKeyDownWithCtx = this._onEscKeyDown.bind(this);
  }

  init() {
    debug(`init`);
    this._renderEduProgsList();

    this._model.onChangeView = () => {
      debug(`_model.onChangeView`);
      this._renderEduProgsList();
    };

    document.addEventListener(`keydown`, this._onEscKeyDownWithCtx);
  }

  _onEscKeyDown(event) {
    if (event.key === Key.ESCAPE) {
      const itemToClose = this._model.items.find((item) =>
        [ModelItemMode.EDIT, ModelItemMode.ADD].includes(item.mode)
      );
      if (itemToClose) {
        itemToClose.mode = ModelItemMode.VIEW;
      }
    }
  }

  _renderEduProgsList() {
    unrender(this._eduProgsList.getElement());
    this._eduProgsList.removeElement();

    render(
      this._container,
      this._eduProgsList.getElement(),
      Position.BEFOREEND
    );
    this._eduProgControllers = [];
    this._model.items.forEach((item) => this._renderEduProg(item));
  }

  _renderEduProg(item) {
    const eduProgController = new EduProgController(
      this._eduProgsList.getElement(),
      item
    );

    this._eduProgControllers.push(eduProgController);
  }
}

export default EduProgsListController;
