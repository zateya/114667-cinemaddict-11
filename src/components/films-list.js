import {createFilmCardTemplate} from './film-card.js';

const createFilmsListTemplate = ({type: listType, title: listTitle, count: filmsCount}) => {
  const isUpcoming = listType === `upcoming`;
  const listClassName = getListClassName(isUpcoming);
  const titleClassName = getTitleClassName(isUpcoming);

  const filmCardTemplate = createFilmCardTemplate();
  const filmsListTemplate = filmCardTemplate.repeat(filmsCount);

  const showMoreButtonTemplate = getShowMoreButtonTemplate(isUpcoming);

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

const getListClassName = (isUpcomingList) => {
  const filmsListClassName = `films-list`;

  if (isUpcomingList) {
    return filmsListClassName;
  }

  return `${filmsListClassName}--extra`;
};

const getTitleClassName = (isUpcomingList) => {
  const filmsTitleClassName = `films-list__title`;

  if (!isUpcomingList) {
    return filmsTitleClassName;
  }

  return `${filmsTitleClassName} visually-hidden`;
};

const getShowMoreButtonTemplate = (isUpcomingList) => {
  if (!isUpcomingList) {
    return ``;
  }

  return `<button class="films-list__show-more">Show more</button>`;
};


export {createFilmsListTemplate};
