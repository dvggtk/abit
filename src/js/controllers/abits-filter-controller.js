const debug = require("debug")("abit:abits-filter-controller");

import EduProgSelectController from "./edu-prog-select-controller";

class AbitsFilterController {
  constructor(abitsModel, eduProgsModel) {
    debug(`constructor`);

    this._abitsModel = abitsModel;
    this._eduProgsModel = eduProgsModel;

    this._onFioChange = this._onFioChange.bind(this);
    this._onEduProgChange = this._onEduProgChange.bind(this);

    this.init();
  }

  init() {
    this._element = document.querySelector(`.abits__filter-panel`);

    const eduProgSelectContainer = this._element.querySelector(
      `.edu-prog-select-container`
    );

    const eduProgs = this._eduProgsModel.items.map((el) => el.data);

    const selectController = new EduProgSelectController(
      eduProgSelectContainer,
      eduProgs,
      ``
    );

    this.bind();
  }

  _onFioChange(event) {
    debug(`_onFioChange`);
    const filterFio = event.target.value.toLowerCase();

    this._abitsModel.filterFn = ({data}) => {
      return data.fio.toLowerCase().startsWith(filterFio);
    };
  }

  _onEduProgChange(event) {
    debug(`_onEduProgChange, event %O`, event);

    const eduProgCode = event.target.value;
    if (eduProgCode) {
      this._abitsModel.filterFn = ({data}) => {
        return data.applications.some((app) => app.eduProg === eduProgCode);
      };
    } else {
      this._abitsModel.filterFn = () => true;
    }
  }

  bind() {
    const fioElement = this._element.querySelector(`.abits__filter-fio`);
    fioElement && fioElement.addEventListener(`input`, this._onFioChange);

    const eduProgElement = this._element.querySelector(`.edu-prog-select`);
    eduProgElement.addEventListener(`change`, this._onEduProgChange);
  }

  unbind() {
    fioElement.removeEventListener(this._onFioChange);
  }
}

export default AbitsFilterController;
