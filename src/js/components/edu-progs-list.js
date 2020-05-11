import AbstractComponent from "./abstract-component";

class EduProgsList extends AbstractComponent {
  getTemplate() {
    return `<div><button type="button" class="edu-progs__btn-add list-btn-add">Добавить образовательную программу</button><ul class="edu-progs__list list"></ul></div>`;
  }
}

export default EduProgsList;
