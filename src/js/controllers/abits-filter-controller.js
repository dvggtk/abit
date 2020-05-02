const debug = require("debug")("abit:abits-filter-controller");

class AbitsFilterController {
  constructor(model) {
    debug(`constructor`);

    this._model = model;
    this._onFioChange = this._onFioChange.bind(this);

    this.init();
  }

  init() {
    this._element = document.querySelector(`.abits__filter-panel`);

    this.bind();
  }

  _onFioChange(event) {
    debug(`_onFioChange`);
    const filterFio = event.target.value.toLowerCase();

    this._model.filterFn = ({data}) => {
      return data.fio.toLowerCase().startsWith(filterFio);
    };
  }

  bind() {
    const fioElement = this._element.querySelector(`.abits__filter-fio`);
    fioElement.addEventListener(`change`, this._onFioChange);
  }

  unbind() {
    fioElement.removeEventListener(this._onFioChange);
  }
}

export default AbitsFilterController;
