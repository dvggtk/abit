import AbstractComponent from "./abstract-component";

class EduProgsList extends AbstractComponent {
  getTemplate() {
    return `<ul class="edu-progs__list list"></ul>`;
  }
}

export default EduProgsList;
