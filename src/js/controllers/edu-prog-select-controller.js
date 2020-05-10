const debug = require("debug")("abit:edu-prog-select-controller");

import EduProgSelect from "../components/edu-prog-select";
import {render, unrender, Position} from "../utils";

class EduProgSelectController {
  constructor(container, eduProgs, selected) {
    this._container = container;
    this._eduProgs = eduProgs;
    this._selected = selected;

    this._eduProgSelect = new EduProgSelect(eduProgs, selected);

    render(
      this._container,
      this._eduProgSelect.getElement(),
      Position.AFTERBEGIN
    );
  }
}

export default EduProgSelectController;
