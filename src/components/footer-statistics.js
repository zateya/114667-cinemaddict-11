import AbstractComponent from './abstract-component.js';
import {formatIntegerWithSpaces} from '../utils/common.js';

const createFooterStatisticsTemplate = (count) => {
  const formatedCount = formatIntegerWithSpaces(count);

  return (
    `<section class="footer__statistics">
      <p>${formatedCount} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
