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

function getElementIndex(element) {
  let el = element;
  let index = 0;
  while (el.previousElementSibling) {
    index++;
    el = el.previousElementSibling;
  }
  return index;
}

class AbitController {
  constructor(container, item) {
    debug(`constructor, item: %O`, item);

    this._item = item;
    if (!Object.values(ModelItemMode).includes(this._item.mode)) {
      throw Error();
    }

    this._formMode =
      this._item.mode === ModelItemMode.ADD
        ? ModelItemMode.ADD
        : ModelItemMode.EDIT;

    this._container = container;
    this._abitData = this._item.data;

    this.initComponents();

    this.create();
  }

  get item() {
    return this._item;
  }

  initComponents() {
    if (this._item.deleted) {
      this._deleted = true;
      this._view = null;
      this._form = null;
      this._element = null;
      return;
    }

    this._view = new AbitView(this._item.data, this._item.isActive);
    this._form = new AbitForm(this._item.data, this._formMode);

    switch (this._item.mode) {
      case ModelItemMode.VIEW:
        this._element = this._view.getElement();
        break;
      case ModelItemMode.EDIT:
      case ModelItemMode.ADD:
        this._element = this._form.getElement();
        break;
      default:
        throw Error();
    }
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
    this._view.getElement().addEventListener(`dblclick`, (event) => {
      this._item.mode = ModelItemMode.EDIT;
    });

    this._form
      .getElement()
      .querySelector(`.form`)
      .addEventListener(`submit`, (e) => {
        debug(`submit`);
        event.preventDefault();

        this._form.getElement().style.backgroundColor = `tomato`;
        7;
        const entry = this._getEntryFromForm();
        debug(`submitted entry %o`, entry);

        this._item.submit(entry, (err) => {
          this._form.getElement().style.backgroundColor = ``;
          if (err) {
            return console.error(err.message);
          }

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

    if (this._formMode === ModelItemMode.EDIT) {
      this._form
        .getElement()
        .querySelector(`.form__btn--delete`)
        .addEventListener(`click`, () => {
          this._item.delete((err) => {
            if (err) {
              return console.error(err.message);
            }
            this.unbind();
          });
        });

      this._form
        .getElement()
        .querySelector(`.form__btn--clone`)
        .addEventListener(`click`, () => {
          this._item.clone();

          this.unbind();
        });
    }
  }

  unbind() {}

  refresh() {
    debug(`refresh %O`, this);
    this.unbind();

    const oldElement = this._element;
    this.initComponents();

    if (this._deleted) {
      unrender(oldElement);
      return;
    }

    this.bind();

    oldElement.replaceWith(this._element);

    const elementIndex = getElementIndex(this._element);
    if (elementIndex !== this._item.index) {
      const baseElement = this._container.children[this._item.index];
      baseElement.before(this._element);
    }
  }

  create(index) {
    debug(`create, index: %O`, index);
    this.bind();

    if (index !== undefined) {
      if (!Number.isInteger(index)) throw Error();

      render(this._container, this._element, Position.BEFOREEND);
      return;
    }

    const baseElement = this._container.children[index];
    if (!baseElement) {
      render(this._container, this._element, Position.BEFOREEND);
      return;
    }

    render(baseElement, this._element, Position.BEFOREBEGIN);
  }
}

export default AbitController;
