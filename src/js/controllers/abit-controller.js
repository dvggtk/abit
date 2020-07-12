/* eslint-disable no-restricted-syntax */
import ListItemController from "./abstract-list-item-controller";
import AbitView from "../components/abit-view";
import AbitForm from "../components/abit-form";

import EduProgSelectController from "./edu-prog-select-controller";

import {draggableEnable} from "../lib/draggable";

import {toKebabCase} from "../utils";

const debug = require("debug")("abit:abit-controller");

class AbitController extends ListItemController {
  constructor(ownerListController, container, item) {
    debug(`constructor, item: %O`, item);

    super(ownerListController, container, item, AbitView, AbitForm);
  }

  initComponents() {
    super.initComponents();
    if (this._item.deleted) return;

    debug(`initComponents, this._form %O`, this._form);

    const eduProgSelectContainers = this._form
      .getElement()
      .querySelectorAll(`.edu-prog-select-container`);

    const eduProgs = this._ownerListController._eduProgsModel.items.map(
      (el) => el.data
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const selectContainer of eduProgSelectContainers) {
      // eslint-disable-next-line no-new
      new EduProgSelectController(
        selectContainer,
        eduProgs,
        selectContainer.dataset.value
      );
    }
  }

  _getEntryFromForm() {
    const entry = super._getEntryFromForm();

    const applicationElements = this._form
      .getElement()
      .querySelectorAll(`.applications .application`);

    entry.applications = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const app of applicationElements) {
      const eduProg = app.querySelector(
        `.application__edu-prog select.edu-prog-select`
      ).value;
      const grade = app.querySelector(`.application__grade input`).value;
      const priority = app.querySelector(`.application__priority input`)
        .checked;
      const disabled = app.querySelector(`.application__disabled input`)
        .checked;

      entry.applications.push({eduProg, grade, priority, disabled});
    }

    // eslint-disable-next-line
    function sanitize(entry, fields) {
      for (const field of fields) {
        // eslint-disable-next-line no-param-reassign
        entry[field] =
          // eslint-disable-next-line no-prototype-builtins
          entry.hasOwnProperty(field) && entry[field] === toKebabCase(field);
      }
    }

    sanitize(entry, [
      `hasEduCertOriginal`,
      `hasMedicalCert`,
      `hasFluoro`,
      `hasVaccine`
    ]);

    debug(`entry %O`, entry);
    return entry;
  }

  bind() {
    super.bind();

    this._form
      .getElement()
      .querySelector(`.applications`)
      .addEventListener(`click`, (event) => {
        if (event.target.classList.contains(`application__btn-delete`)) {
          let li = event.target;
          while (li.tagName !== `LI`) {
            li = li.parentElement;
          }
          li.remove();
        }
      });

    const btnAdd = this._form
      .getElement()
      .querySelector(`.applications .applications__btn-add`);

    btnAdd.addEventListener(`click`, () => {
      const application = {
        eduProg: ``,
        grade: ``,
        priority: false,
        disabled: false
      };

      const applicationsList = this._form
        .getElement()
        .querySelector(`.applications-list`);

      // FIXME это шаблон дублируется в applications-form
      const html = `
      <li class="applications-list__item">
        <div class="application">
          <label class="application__edu-prog">
            <div class="edu-prog-select-container" data-value="${
              application.eduProg
            }"></div>
          </label>
          <label class="application__grade">
            <input size="1" maxlength="1" pattern="[12345]" value="${
              application.grade
            }"/>
          </label>
          <label class="application__priority">
            <input type="checkbox" value="priority"${
              application.priority ? ` checked` : ``
            }/><span>приоритет</span>
          </label>
          <label class="application__disabled">
            <input type="checkbox" value="disabled"${
              application.disabled ? ` checked` : ``
            }/><span>спрятать</span>
          </label>
          <button class="application__btn-delete" type="button"><span class="visually-hidden">удалить<span></button>
        </div>
      </li>`.trim();

      const div = document.createElement(`DIV`);
      div.insertAdjacentHTML(`beforeend`, html);
      const item = div.firstChild;

      const selectContainer = item.querySelector(`.edu-prog-select-container`);

      const eduProgs = this._ownerListController._eduProgsModel.items.map(
        (el) => el.data
      );

      // eslint-disable-next-line no-new
      new EduProgSelectController(
        selectContainer,
        eduProgs,
        selectContainer.dataset.value
      );

      applicationsList.append(item);
    });

    const appList = this._form.getElement().querySelector(`.applications-list`);
    draggableEnable(appList);
  }
}

export default AbitController;
