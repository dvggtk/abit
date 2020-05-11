const debug = require("debug")("abit:edu-prog-select-controller");

import AbstractComponent from "./abstract-component";
import {clone} from "../utils";

const BASE_EDU_LEVEL_9 = `9 классов`;
const BASE_EDU_LEVEL_11 = `11 классов`;
const FULL_TIME = `очная`;
const DISTANCE = `заочная`;

class EduProgSelect extends AbstractComponent {
  constructor(eduProgs, selected) {
    super();
    this._eduProgs = clone(eduProgs);
    this._selected = selected;

    //1 Очные 9 классов
    this._eduProgs9 = this._eduProgs.filter(
      (eduProg) => eduProg.baseEduLevel === BASE_EDU_LEVEL_9
    );

    //2 Очные 11 классов
    this._eduProgs11fullTime = this._eduProgs.filter(
      (eduProg) =>
        eduProg.baseEduLevel === BASE_EDU_LEVEL_11 &&
        eduProg.eduForm === FULL_TIME
    );

    //3 Заочные
    this._eduProgsDistance = this._eduProgs.filter(
      (eduProg) => eduProg.eduForm === DISTANCE
    );
  }

  getTemplate() {
    const getOptions = (eduProgs) =>
      eduProgs.reduce((acc, cur) => {
        return (
          acc +
          `<option${cur.code === this._selected ? ` selected` : ``}>${
            cur.code
          }</option>`
        );
      }, ``);

    // prettier-ignore
    const html = `
    <select class="edu-prog-select">
      <option></option>
      <optgroup label="11 классов. Очная">${getOptions(this._eduProgs11fullTime)}</optgroup>
      <optgroup label="9 классов. Очная">${getOptions(this._eduProgs9)}</optgroup>
      <optgroup label="Заочная">${getOptions(this._eduProgsDistance)}</optgroup>
    </select>`.trim();

    return html;
  }
}

export default EduProgSelect;
