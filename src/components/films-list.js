import {createElement} from '../utils.js';

const createFilmsListTemplate = (list) => {
  const {type, title} = list;
  const isAllList = type === `all`;

  const listClass = (isAllList) ? `films-list` : `films-list--${type}`;
  const titleClass = (isAllList) ? `films-list__title visually-hidden` : `films-list__title`;

  return (
    `<section class="${listClass}">
      <h2 class="${titleClass}">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsList {
  constructor(list) {
    this._list = list;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._list);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
