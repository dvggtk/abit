import EduProgView from "../components/edu-prog-view";
import EduProgForm from "../components/edu-prog-form";
import {
  render,
  unrender,
  Position,
  Key,
  toCamelCase,
  clone,
  ModelItemMode
} from "../utils";

//FIXME не работает, сделать как AbitController
class EduProgController {
  constructor(container, item) {
    this._item = item;
    if (!Object.values(ModelItemMode).includes(item.mode)) {
      throw Error();
    }
    this._formMode =
      item.mode === ModelItemMode.ADD ? ModelItemMode.ADD : ModelItemMode.EDIT;

    this._container = container;

    this._eduProgData = this._item.data;

    this._eduProgView = new EduProgView(item.data, item.isActive);
    this._eduProgForm = new EduProgForm(item.data, this._formMode);

    this.create();
  }

  _getEntryFromForm() {
    const formData = new FormData(
      this._eduProgForm.getElement().querySelector(`form`)
    );

    const entry = Array.from(formData.entries()).reduce((acc, cur) => {
      acc[toCamelCase(cur[0])] = cur[1];
      return acc;
    }, {});

    return entry;
  }

  bind() {
    this._eduProgView.getElement().addEventListener(`dblclick`, () => {
      this._item.mode = ModelItemMode.EDIT;
    });

    this._eduProgForm.getElement().addEventListener(`submit`, (event) => {
      event.preventDefault();

      this._eduProgForm.getElement().style.backgroundColor = `tomato`;
      const entry = this._getEntryFromForm();

      this._item.submit(entry, (err) => {
        this._eduProgForm.getElement().style.backgroundColor = ``;
        if (err) return console.error(err.message);

        this.unbind();
      });
    });

    this._eduProgForm
      .getElement()
      .querySelector(`button.edu-prog-form__btn--cancel`)
      .addEventListener(`click`, () => {
        this._item.cancelEdit();

        this.unbind();
      });

    this._eduProgForm
      .getElement()
      .querySelector(`button.edu-prog-form__btn--delete`)
      .addEventListener(`click`, () => {
        this._item.delete((err) => {
          if (err) {
            return console.error(err.message);
          }
          this.unbind();
        });
      });

    this._eduProgForm
      .getElement()
      .querySelector(`button.edu-prog-form__btn--clone`)
      .addEventListener(`click`, () => {
        this._item.clone();

        this.unbind();
      });
  }

  unbind() {
    document.removeEventListener(`keydown`, this._onEscKeyDownWithCtx);
  }

  create() {
    this.bind();

    let elementToShow;
    switch (this._item.mode) {
      case ModelItemMode.VIEW:
        elementToShow = this._eduProgView.getElement();
        break;
      case ModelItemMode.EDIT:
      case ModelItemMode.ADD:
        elementToShow = this._eduProgForm.getElement();
        break;
      default:
        throw Error();
    }

    render(this._container, elementToShow, Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._eduProgForm.getElement())) {
      this._eduProgForm
        .getElement()
        .replaceWith(this._eduProgView.getElement());
    }
  }
}

export default EduProgController;
