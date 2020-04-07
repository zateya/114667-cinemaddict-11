import {createFilmCardTemplate} from './film-card.js';

const createFilmsListTemplate = ({type: listType, title: listTitle, count: filmsCount}) => {
  const isUpcomingList = listType === `upcoming`;

  const listClassName = (isUpcomingList) ? `films-list` : `films-list--extra`;
  const titleClassName = (isUpcomingList) ? `films-list__title visually-hidden` : `films-list__title`;

  const filmCardTemplate = createFilmCardTemplate();
  const filmsListTemplate = filmCardTemplate.repeat(filmsCount);

  const showMoreButtonTemplate = getShowMoreButtonTemplate(isUpcomingList);

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

const getShowMoreButtonTemplate = (isUpcomingList) => {
  if (!isUpcomingList) {
    return ``;
  }

  return `<button class="films-list__show-more">Show more</button>`;
};


export {createFilmsListTemplate};
