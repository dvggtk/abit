const debug = require("debug")("abit:tabs-controller");

class TabsController {
  constructor() {
    debug(`constructor`);

    const tabsElements = document.querySelectorAll(`.tabs`);

    for (const tabsElement of tabsElements) {
      const btns = tabsElement.querySelectorAll(
        `.tabs .tabs__btn input[type=radio]`
      );
      const panels = tabsElement.querySelectorAll(
        `.tabs__panel-list .tabs__panel`
      );

      function setPanelState() {
        let activePanelId;
        for (const btn of btns) {
          if (btn.checked) {
            activePanelId = btn.dataset.panelId;
            break;
          }
        }
        for (const panel of panels) {
          if (activePanelId === panel.dataset.panelId) {
            panel.classList.add(`tabs__panel--open`);
          } else {
            panel.classList.remove(`tabs__panel--open`);
          }
        }
      }

      setPanelState();

      tabsElement.addEventListener(`click`, (e) => {
        if (e.target.type === `radio`) setPanelState();
        // debug(`click \n%o\n%o\n%o`, e, btns, panels);
      });
    }
  }
}

export default TabsController;
