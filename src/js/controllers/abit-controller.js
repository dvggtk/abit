const debug = require("debug")("abit:abit-controller");

import ListController from "./abstract-list-controller";
import AbitView from "../components/abit-view";
import AbitForm from "../components/abit-form";

import {toKebabCase} from "../utils";

class AbitController extends ListController {
  constructor(container, item) {
    debug(`constructor, item: %O`, item);

    super(container, item, AbitView, AbitForm);
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
