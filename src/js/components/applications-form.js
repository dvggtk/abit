import AbstractComponent from "./abstract-component";

// eslint-disable-next-line no-unused-vars
const debug = require("debug")("abit:applications-form");

class ApplicationsForm extends AbstractComponent {
  constructor(applications) {
    if (!applications) throw new Error("Halt");

    super();

    this._applications = applications;
  }

  getTemplate() {
    const applicationsListItems = this._applications
      .map((application) => {
        return `<li class="applications-list__item">
        <div class="application">
          <label class="application__edu-prog">
            <div class="edu-prog-select-container" data-value="${
              application.eduProg
            }"></div>
          </label>
          <label class="application__grade">
            <input size="1" maxlength="1" pattern="[12345]" value="${
              application.grade
            }"/>
          </label>
          <label class="application__priority">
            <input type="checkbox" value="priority"${
              application.priority ? ` checked` : ``
            }/><span>приоритет</span>
          </label>
          <label class="application__disabled">
            <input type="checkbox" value="disabled"${
              application.disabled ? ` checked` : ``
            }/><span>спрятать</span>
          </label>
          <button class="application__btn-delete" type="button"><span class="visually-hidden">удалить<span></button>
        </div>
      </li>`;
      })
      .join(``);

    return `<section class="applications">
      <h5 class="visually-hidden">Заявления абитуриента</h5>
      <div class="applications__list-container">
        <ul class="applications-list">${applicationsListItems}</ul>
      </div>
      <button class="applications__btn-add" type="button">добавить заявление</button>
    </section>`;
  }
}

export default ApplicationsForm;
