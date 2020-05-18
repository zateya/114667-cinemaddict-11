import AbstractComponent from './abstract-component.js';
import {HREF_ID_PREFIX} from '../constant.js';

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const isLinkItem = evt.target.hasAttribute(`href`);
      const menuItem = isLinkItem ? evt.target.getAttribute(`href`).slice(HREF_ID_PREFIX.length) : null;

      handler(menuItem);
    });

  }
}
