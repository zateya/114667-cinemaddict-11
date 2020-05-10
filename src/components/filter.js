import AbstractComponent from './abstract-component.js';
import {setActiveElement} from '../utils/common.js';

const createFilterItemMarkup = (item) => {
  const {name, type, count, isActive} = item;

  const activeClass = isActive ? `main-navigation__item--active` : ``;
  const hasCount = count !== null;

  return (
    `<a href="#${type}" data-filter-type="${type}" class="main-navigation__item ${activeClass}">
      ${name}
      ${hasCount ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItemsMarkup = filters.map((filter) => createFilterItemMarkup(filter)).join(`\n`);

  return (
    `<div class="main-navigation__items">
      ${filterItemsMarkup}
    </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setActiveItem(filterItem) {
    const container = this.getElement();
    const item = this.getElement().querySelector(`[data-filter-type = ${filterItem}]`);
    const activeClass = `main-navigation__item--active`;

    setActiveElement(container, item, activeClass);
  }

  setFilterClickHandler(handler) {

    const filterElements = Array.from(this.getElement().querySelectorAll(`.main-navigation__item`));

    filterElements.forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const currentTarget = evt.currentTarget;
        const filterType = currentTarget.dataset.filterType;
        this.setActiveItem(filterType);
        handler(filterType);
      });
    });
  }
}
