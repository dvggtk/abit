const debug = require("debug")("abit:abit-controller");

import ListItemController from "./abstract-list-item-controller";
import AbitView from "../components/abit-view";
import AbitForm from "../components/abit-form";

import EduProgSelectController from "./edu-prog-select-controller";

import {toKebabCase} from "../utils";

class AbitController extends ListItemController {
  constructor(ownerListController, container, item) {
    debug(`constructor, item: %O`, item);

    super(ownerListController, container, item, AbitView, AbitForm);
  }

  initComponents() {
    super.initComponents();

    const eduProgSelectContainers = this._form
      .getElement()
      .querySelectorAll(`.edu-prog-select-container`);

    debug(
      `%O, eduProgSelectContainers %O`,
      this._ownerListController._eduProgsModel.items.map((el) => el.data),
      eduProgSelectContainers
    );

    const eduProgs = this._ownerListController._eduProgsModel.items.map(
      (el) => el.data
    );

    for (const selectContainer of eduProgSelectContainers) {
      const selectController = new EduProgSelectController(
        selectContainer,
        eduProgs,
        this._item.data.code
      );
    }
  }

  _getEntryFromForm() {
    const entry = super._getEntryFromForm();

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
}

export default AbitController;
