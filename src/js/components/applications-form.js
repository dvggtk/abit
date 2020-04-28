const debug = require("debug")("abit:applications-form");

import AbstractComponent from "./abstract-component";

class ApplicationsForm extends AbstractComponent {
  constructor(applications) {
    if (!applications) throw Error();

    super();

    this._applications = applications;
  }

  getTemplate() {
    const eduProgs = [`ЗИО`, `СЭЗИС`, `БУ`, `ТОРАТ`, `ПСО`];

    const applicationsListItems = this._applications
      .map((application) => {
        return `<li class="applications-list__item">
        <div class="application">
          <label class="application__edu-prog">
            <select>${eduProgs
              .map(
                (eduProg) =>
                  `<option value="${eduProg}"${
                    application.eduProg === eduProg ? ` selected` : ``
                  }>${eduProg}</option>`
              )
              .join(``)}
            </select>
          </label>
          <label class="application__grade">
            <input size="1" maxlength="1" pattern="[12345]"/>
          </label>
          <label class="application__hasEduCertOriginal">
            <input type="checkbox" /><span>приоритет</span>
          </label>
          <label class="application__active">
            <input type="checkbox"/><span>показывать?</span>
          </label>
          <button class="application__btn-delete" type="button">удалить</button>
        </div>
      </li>`;
      })
      .join(``);

    return `<section class="applications">
      <h5 class="visually-hidden">Заявления абитуриента</h5>
      <div class="applications__list-container">
        <ul class="applications-list">${applicationsListItems}</ul>
      </div>
      <button class="application__btn-add" type="button">добавить заявление</button>
    </section>`;
  }
}

export default ApplicationsForm;
