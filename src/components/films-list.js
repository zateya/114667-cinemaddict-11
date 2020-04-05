import {createFilmCardTemplate} from './film-card.js';

const createFilmsListTemplate = ({type: listType, title: listTitle, count: filmsCount}) => {
  const listClassName = getListClassName(listType);
  const titleClassName = getTitleClassName(listType);

  const filmCardTemplate = createFilmCardTemplate();
  const filmsListTemplate = filmCardTemplate.repeat(filmsCount);

  const showMoreButtonTemplate = getShowMoreButtonTemplate(listType);

  return (
    `<section class="${listClassName}">
      <h2 class="${titleClassName}">${listTitle}</h2>

      <div class="films-list__container">
        ${filmsListTemplate}
      </div>

      ${showMoreButtonTemplate}
    </section>`
  );
};

const getListClassName = (type) => {
  const filmsListClassName = `films-list`;

  if (type !== `extra`) {
    return filmsListClassName;
  }

  return `${filmsListClassName}--extra`;
};

const getTitleClassName = (type) => {
  const filmsTitleClassName = `films-list__title`;

  if (type !== `upcoming`) {
    return filmsTitleClassName;
  }

  return `${filmsTitleClassName} visually-hidden`;
};

const getShowMoreButtonTemplate = (type) => {
  if (type !== `upcoming`) {
    return ``;
  }

  return `<button class="films-list__show-more">Show more</button>`;
};


export {createFilmsListTemplate};
