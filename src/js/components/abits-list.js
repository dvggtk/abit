import AbstractComponent from "./abstract-component";

class AbitsList extends AbstractComponent {
  getTemplate() {
    return `
    <div>
      <button type="button" class="abits__btn-add list-btn-add">Добавить абитуриента</button>
      <ul class="abits-list list"></ul>
    </div>`.trim();
  }
}

export default AbitsList;
