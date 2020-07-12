const createElement = (html) => {
  const div = document.createElement(`div`);
  div.insertAdjacentHTML(`afterbegin`, html);
  return div.firstChild;
};

class AbstractComponent {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.remove();
    }
    this._element = null;
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    throw new Error(`Abstract method not implemented`);
  }
}

export default AbstractComponent;
