import AbstractComponent from './abstract-component.js';
import {SortType, sortTypes} from '../constant.js';

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

      const container = target.closest(`.sort`);
      const activeClass = `sort__button--active`;
      const acttiveElement = container.querySelector(`.${activeClass}`);
      acttiveElement.classList.remove(activeClass);
      target.classList.add(activeClass);

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
