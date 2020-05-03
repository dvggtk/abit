import AbstractComponent from "./abstract-component";

class AbitsList extends AbstractComponent {
  getTemplate() {
    return `<ul class="abits-list list"></ul>`;
  }
}

export default AbitsList;
