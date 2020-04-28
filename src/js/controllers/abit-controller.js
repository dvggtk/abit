const debug = require("debug")("abit:abit-controller");

import AbitView from "../components/abit-view";
import AbitForm from "../components/abit-form";

import {
  render,
  unrender,
  Position,
  Key,
  toCamelCase,
  toKebabCase,
  clone,
  ModelItemMode
} from "../utils";

class AbitController {
  constructor(container, item) {
    this._item = item;
    if (!Object.values(ModelItemMode).includes(item.mode)) {
      throw Error();
    }
    this._formMode =
      item.mode === ModelItemMode.ADD ? ModelItemMode.ADD : ModelItemMode.EDIT;

    this._container = container;
    this._abitData = this._item.data;
    this._view = new AbitView(item.data, item.isActive);
    this._form = new AbitForm(item.data, this._formMode);

    this.create();
  }

  _getEntryFromForm() {
    const formData = new FormData(
      this._form.getElement().querySelector(`form`)
    );

    const entry = Array.from(formData.entries()).reduce((acc, cur) => {
      acc[toCamelCase(cur[0])] = cur[1];
      return acc;
    }, {});

    //FIXME временная строка
    entry.applications = [];

    function sanitize(entry, fields) {
      for (const field of fields) {
        entry[field] =
          entry.hasOwnProperty(field) && entry[field] === toKebabCase(field);
      }
    }

    sanitize(entry, [
      `hasEduCertOriginal`,
      `hasMedicalCert`,
      `hasFluoro`,
      `hasVaccine`
    ]);

    return entry;
  }

  bind() {
    this._view.getElement().addEventListener(`dblclick`, () => {
      this._item.mode = ModelItemMode.EDIT;
    });

    this._form.getElement().addEventListener(`submit`, (e) => {
      debug(`submit`);
      event.preventDefault();

      this._form.getElement().style.backgroundColor = `tomato`;

      const entry = this._getEntryFromForm();
      debug(`submitted entry ?o`, entry);

      this._item.submit(entry, (err) => {
        this._form.getElement().style.backgroundColor = ``;
        if (err) return console.error(err.message);

        this.unbind();
      });
    });

    this._form
      .getElement()
      .querySelector(`.form__btn--cancel`)
      .addEventListener(`click`, () => {
        this._item.cancelEdit();

        this.unbind();
      });
  }

  unbind() {}

  create() {
    this.bind();

    let elementToShow;
    switch (this._item.mode) {
      case ModelItemMode.VIEW:
        elementToShow = this._view.getElement();
        break;
      case ModelItemMode.EDIT:
      case ModelItemMode.ADD:
        elementToShow = this._form.getElement();
        break;
      default:
        throw Error();
    }

    render(this._container, elementToShow, Position.BEFOREEND);
  }
}

export default AbitController;
