import AbstractComponent from './abstract-component.js';
import {SortType, sortTypes} from '../constant.js';
import {setActiveElement} from '../utils/common.js';

const createSortItemMarkup = (sortType, isActive) => {
  const activeClass = isActive ? `sort__button--active` : ``;

  return `<li><a href="#" data-sort-type="${sortType}" class="sort__button ${activeClass}">Sort by ${sortType}</a></li>`;
};

const createSortTemplate = () => {
  const sortItemsMarkup = sortTypes.map((it, i) => createSortItemMarkup(it, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  reset() {
    this._currentSortType = SortType.DEFAULT;
    this.setActiveItem(this._currentSortType);
  }

  setActiveItem(sortType) {
    const container = this.getElement();
    const item = container.querySelector(`[data-sort-type = ${sortType}]`);
    const activeClass = `sort__button--active`;

    setActiveElement(container, item, activeClass);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const target = evt.target;


      if (target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this.setActiveItem(this._currentSortType);

      handler(this._currentSortType);
    });
  }
}
