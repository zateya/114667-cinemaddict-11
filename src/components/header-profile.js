import AbstractComponent from './abstract-component.js';

const createHeaderProfileTemplate = (rank) => {
  if (rank === ``) {
    return ``;
  }

  return (
    `<section class="header__profile profile">
      ${rank}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile extends AbstractComponent {
  constructor(rank) {
    super();

    this._rank = rank;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._rank);
  }
}
