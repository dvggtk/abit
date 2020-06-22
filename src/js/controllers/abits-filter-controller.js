const debug = require("debug")("abit:abits-filter-controller");

import EduProgSelectController from "./edu-prog-select-controller";

class AbitsFilterController {
  constructor(abitsModel, eduProgsModel) {
    debug(`constructor`);

    this._abitsModel = abitsModel;
    this._eduProgsModel = eduProgsModel;

    this._onFioChange = this._onFioChange.bind(this);
    this._onEduProgChange = this._onEduProgChange.bind(this);
    this._onSortOrderChange = this._onSortOrderChange.bind(this);

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

  _onSortOrderChange(event) {
    debug(`_onSortOrderChange, event %O`, event);

    const parseDate = (dateValue) => {
      const re = /(\d{1,2})[.,-\\\/](\d{1,2})[.,-\\\/](\d{4}|\d{1,2})/;
      const match = String(dateValue).match(re);
      if (match === null) return null;

      const [, dd, mm, yyyy] = String(dateValue).match(re);
      const date = parseInt(dd);
      const month = parseInt(mm);
      let year = parseInt(yyyy);
      if (year < 100) year = year + 2000;

      return new Date(year, month, date);
    };

    const sortOrder = event.target.value;
    switch (sortOrder) {
      case "fio":
        {
          const cmpFn = (a, b) => {
            const v1 = a.fio;
            const v2 = b.fio;
            if (v1 < v2) return 1;
            if (v1 > v2) return -1;
            return 0;
          };
          this._abitsModel.compareFn = (item1, item2) =>
            cmpFn(item1.data, item2.data);
        }
        break;

      case "regDate":
        {
          const cmpFn = (a, b) => {
            const v1 = parseDate(a.regDate);
            const v2 = parseDate(b.regDate);
            if (v1 < v2) return 1;
            if (v1 > v2) return -1;
            return 0;
          };
          this._abitsModel.compareFn = (item1, item2) =>
            cmpFn(item1.data, item2.data);
        }
        break;
      case "needDorm":
        {
          const cmpFn = (a, b) => {
            const v1 = a.needDorm;
            const v2 = b.needDorm;

            if (v1 < v2) return 1;
            if (v1 > v2) return -1;

            const d1 = parseDate(a.regDate);
            const d2 = parseDate(b.regDate);

            // даты по возрастанию
            if (d1 < d2) return -1;
            if (d1 > d2) return 1;

            return 0;
          };
          this._abitsModel.compareFn = (item1, item2) =>
            cmpFn(item1.data, item2.data);
        }
        break;
      default:
    }
  }

  bind() {
    const fioElement = this._element.querySelector(`.abits__filter-fio`);
    fioElement && fioElement.addEventListener(`input`, this._onFioChange);

    const eduProgElement = this._element.querySelector(`.edu-prog-select`);
    eduProgElement.addEventListener(`change`, this._onEduProgChange);

    const sortOrderElement = this._element.querySelector(`.sort-order__select`);
    sortOrderElement.addEventListener(`change`, this._onSortOrderChange);
  }

  unbind() {
    fioElement.removeEventListener(this._onFioChange);
  }
}

export default AbitsFilterController;
