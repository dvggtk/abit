const debug = require("debug")("abit:debug-panel-controller");

class DebugPanelController {
  constructor(api) {
    this._api = api;

    this._element = document.querySelector(`.debug-panel`);

    this._btnOnClick = this._btnOnClick.bind(this);

    this.bind();
  }
  bind() {
    this._bindedElements = [];
    for (const el of this._element.querySelectorAll(`.debug-panel__btn`)) {
      el.addEventListener(`click`, this._btnOnClick);
      this._bindedElements.push(el);
    }
  }

  unbind() {
    for (const el of this._bindedElements) {
      el.removeEventListener(this._btnOnClick);
    }
  }

  _btnOnClick(event) {
    debug(`btnOnClick click, event %O`, event);

    if (event.target.classList.contains(`debug-panel__btn--clear`)) {
      this._api.clear((err) => {
        if (err) return console.error(err);
        window.location.reload();
      });
      return;
    }

    if (event.target.classList.contains(`debug-panel__btn--add-abits`)) {
      const [count] = event.target.textContent.trim().match(/\d+/);
      this._api.addFakeAbits(count, (err) => {
        if (err) return console.error(err);
        window.location.reload();
      });
      return;
    }

    if (event.target.classList.contains(`debug-panel__btn--add-edu-progs`)) {
      this._api.addFakeEduProgs((err) => {
        if (err) return console.error(err);
        window.location.reload();
      });
      return;
    }
  }
}

export default DebugPanelController;
