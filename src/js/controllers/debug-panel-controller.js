/* eslint-disable no-console */
const debug = require("debug")("abit:debug-panel-controller");
const FileSaver = require("file-saver");
const {format} = require("date-fns");

class DebugPanelController {
  constructor(api) {
    this._api = api;

    this._element = document.querySelector(`.debug-panel`);

    this._btnOnClick = this._btnOnClick.bind(this);

    this.bind();
  }

  bind() {
    this._bindedElements = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const el of this._element.querySelectorAll(`.debug-panel__btn`)) {
      el.addEventListener(`click`, this._btnOnClick);
      this._bindedElements.push(el);
    }

    this._element
      .querySelector(`.debug-panel__abit-count`)
      .addEventListener(`change`, (event) => {
        const btnAddAbits = this._element.querySelector(
          `.debug-panel__btn--add-abits`
        );
        btnAddAbits.textContent = btnAddAbits.textContent
          .trim()
          .replace(/\d+/, event.target.value);
      });
  }

  unbind() {
    // eslint-disable-next-line no-restricted-syntax
    for (const el of this._bindedElements) {
      el.removeEventListener(this._btnOnClick);
    }
  }

  _btnOnClick(event) {
    debug(`btnOnClick click, event %O`, event);

    // FIXME сделать обновление компонентов без перезагрузки страницы window.location.reload()
    // потому что при перезагрузке сбрасывается seedrandom

    if (event.target.classList.contains(`debug-panel__btn--clear`)) {
      this._api.clear((err) => {
        if (err) return console.error(err);
        window.location.reload();
        return 0;
      });

      return;
    }

    if (event.target.classList.contains(`debug-panel__btn--add-abits`)) {
      const [count] = event.target.textContent.trim().match(/\d+/);
      this._api.addFakeAbits(count, (err) => {
        if (err) return console.error(err);
        window.location.reload();
        return 0;
      });

      return;
    }

    if (event.target.classList.contains(`debug-panel__btn--add-edu-progs`)) {
      this._api.addFakeEduProgs((err) => {
        if (err) return console.error(err);
        window.location.reload();
        return 0;
      });
      return;
    }

    if (event.target.classList.contains(`debug-panel__btn--backup`)) {
      this._api.backup((err, res) => {
        if (err) return console.error(err);
        const json = JSON.stringify(res, null, 4);
        const datemark = format(new Date(), `yyyyMMddhhmmss`);
        console.log(`---------`, datemark);
        const filename = `abit-${datemark}.json`;

        const blob = new Blob([json], {
          type: "application/json;charset=utf-8"
        });
        FileSaver.saveAs(blob, filename);

        console.log(`backup`, res);

        return 0;
      });
    }
  }
}

export default DebugPanelController;
