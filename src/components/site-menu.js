const createMenuItemsMarkup = (item, isActive, hasCount) => {
  const {title, anchor, count} = item;

  const activeClass = isActive ? `main-navigation__item--active` : ``;

  return (
    `<a href="#${anchor}" class="main-navigation__item ${activeClass}">
      ${title}
      ${hasCount ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createSiteMenuTemplate = (items) => {
  const menuItemsMarkup = items.map((it, i) => createMenuItemsMarkup(it, i === 0, i !== 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${menuItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export {createSiteMenuTemplate};
