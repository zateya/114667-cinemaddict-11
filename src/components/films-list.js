import AbstractComponent from './abstract-component.js';
import {ListType} from '../constant.js';

const createFilmsListTemplate = (title, params) => {
  const {type = ListType.MAIN, isTitleHidden = false} = params;

  const listDefaultClass = `films-list`;
  const listClass = type === ListType.EXTRA ? `${listDefaultClass}--${type}` : listDefaultClass;

  const titleDefaultClass = `films-list__title`;
  const titleClass = isTitleHidden ? `${titleDefaultClass} visually-hidden` : titleDefaultClass;

  return (
    `<section class="${listClass}">
      <h2 class="${titleClass}">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsList extends AbstractComponent {
  constructor(title, params) {
    super();

    this._title = title;
    this._params = params;
  }

  getTemplate() {
    return createFilmsListTemplate(this._title, this._params);
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
