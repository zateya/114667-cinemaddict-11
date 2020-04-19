import AbstractComponent from './abstract-component.js';
import {SortType} from '../constant.js';

const createSortItemMarkup = (sortType, isActive) => {
  const activeClass = isActive ? `sort__button--active` : ``;

  return `<li><a href="#" class="sort__button ${activeClass}">Sort by ${sortType}</a></li>`;
};

const createSortTemplate = () => {
  const sortItemsMarkup = Object.values(SortType).map((it, i) => createSortItemMarkup(it, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortTemplate();
  }
}
