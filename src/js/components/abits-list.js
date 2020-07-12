import AbstractComponent from "./abstract-component";

class AbitsList extends AbstractComponent {
  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return `
    <div>
      <button type="button" class="abits__btn-add list-btn-add">Добавить абитуриента</button>
      <ul class="abits-list list"></ul>
    </div>`.trim();
  }
}

export default AbitsList;
