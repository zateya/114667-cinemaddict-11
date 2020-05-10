import AbstractComponent from './abstract-component.js';

const createNoFilmsTemplate = (message) => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">${message}</h2>
    </section>`
  );
};

export default class NoFilms extends AbstractComponent {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._message);
  }
}
