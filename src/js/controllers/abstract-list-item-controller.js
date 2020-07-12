/* eslint-disable no-console */
import {
  render,
  unrender,
  Position,
  // Key,
  toCamelCase,
  // toKebabCase,
  // clone,
  ModelItemMode
} from "../utils";

const debug = require("debug")("abit:abstract-list-item-controller");

function getElementIndex(element) {
  let el = element;
  let index = 0;
  while (el.previousElementSibling) {
    index += 1;
    el = el.previousElementSibling;
  }
  return index;
}
class AbstractListItemController {
  constructor(ownerListController, container, item, View, Form) {
    // debug(`constructor, item: %O`, item);

    this._View = View;
    this._Form = Form;

    this._ownerListController = ownerListController;

    this._item = item;
    if (!Object.values(ModelItemMode).includes(this._item.mode)) {
      throw new Error("Halt");
    }

    this._container = container;

    this.initComponents();

    this.create();
  }

  get item() {
    return this._item;
  }

  initComponents() {
    this._formMode =
      this._item.mode === ModelItemMode.ADD
        ? ModelItemMode.ADD
        : ModelItemMode.EDIT;

    if (this._item.deleted) {
      this._deleted = true;
      this._view = null;
      this._form = null;
      this._element = null;
      return;
    }

    this._view = new this._View(this._item.data, this._item.isActive);
    this._form = new this._Form(this._item.data, this._formMode);

    switch (this._item.mode) {
      case ModelItemMode.VIEW:
        this._element = this._view.getElement();
        break;
      case ModelItemMode.EDIT:
      case ModelItemMode.ADD:
        this._element = this._form.getElement();
        break;
      default:
        throw new Error("Halt");
    }

    this._onEdit = this._onEdit.bind(this);
  }

  _getEntryFromForm() {
    const formData = new FormData(
      this._form.getElement().querySelector(`form`)
    );

    // eslint-disable-next-line unicorn/no-reduce
    const entry = [...formData.entries()].reduce((acc, cur) => {
      // eslint-disable-next-line prefer-destructuring
      acc[toCamelCase(cur[0])] = cur[1];
      return acc;
    }, {});

    return entry;
  }

  _onEdit() {
    debug(`onEdit`);
    this._item.mode = ModelItemMode.EDIT;
    debug(`onEdit, this._item: %O`, this._item);
  }

  bind() {
    this._view
      .getElement()
      .querySelector(`.list__btn--edit`)
      .addEventListener(`click`, this._onEdit);

    this._view.getElement().addEventListener(`dblclick`, this._onEdit);

    this._form
      .getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (event) => {
        debug(`submit`);
        event.preventDefault();

        this._form.getElement().style.backgroundColor = `tomato`;

        const entry = this._getEntryFromForm();
        debug(`submitted entry %o`, entry);

        this._item.submit(entry, (err) => {
          this._form.getElement().style.backgroundColor = ``;
          if (err) {
            return console.error(err.message);
          }

          this.unbind();
          return 0;
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
            return 0;
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

  // eslint-disable-next-line class-methods-use-this
  unbind() {}

  refresh() {
    debug(`refresh %O`, this);
    this.unbind();

    const oldElement = this._element;
    this.initComponents();

    if (this._deleted || !this._item.visible) {
      unrender(oldElement);
      return;
    }

    this.bind();

    oldElement.replaceWith(this._element);

    const elementIndex = getElementIndex(this._element);
    debug(`elementIndex %d`, elementIndex);
    if (elementIndex !== this._item.index) {
      const baseElement = this._container.children[this._item.index];
      baseElement.before(this._element);
    }
  }

  create(index) {
    debug(`create, index: %O`, index);
    this.bind();

    if (index !== undefined) {
      if (!Number.isInteger(index)) throw new Error("Halt");

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

export default AbstractListItemController;
