import AbstractComponent from './abstract-component.js';

const createFilmsListTemplate = (list) => {
  const {type, title} = list;
  const isAllList = type === `all`;

  const listDefaultClass = `films-list`;
  const listClass = (isAllList) ? listDefaultClass : `${listDefaultClass}--${type}`;

  const titleDefaultClass = `films-list__title`;
  const titleClass = (isAllList) ? `${titleDefaultClass} visually-hidden` : titleDefaultClass;

  return (
    `<section class="${listClass}">
      <h2 class="${titleClass}">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsList extends AbstractComponent {
  constructor(list) {
    super();

    this._list = list;
  }

  getTemplate() {
    return createFilmsListTemplate(this._list);
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
