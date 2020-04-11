import {createHeaderProfileTemplate} from './components/header-profile.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sorting.js';
import {createFilmsTemplate} from './components/films.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createFilmsListTemplate} from './components/films-list.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {render, createTemplateNode} from './utils.js';
import {filmLists} from './const.js';
import {generateMenuItems} from './mock/menu.js';
import {generateFilms} from './mock/film.js';

const FILMS_COUNT = 20;
const FILMS_RATED_COUNT = 2;
const FILMS_COMMENTED_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createHeaderProfileTemplate());

const menuItems = generateMenuItems();
render(siteMainElement, createSiteMenuTemplate(menuItems));

render(siteMainElement, createSortTemplate());

render(siteMainElement, createFilmsTemplate());
const filmsElement = siteMainElement.querySelector(`.films`);

filmLists.map((it) => render(filmsElement, createFilmsListTemplate(it)));

const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsContainer = filmsListElement.querySelector(`.films-list__container`);
const ratedFilmsContainer = filmsElement.querySelector(`.films-list--extra .films-list__container`);
const commentedFilmsContainer = filmsElement.querySelector(`.films-list--extra:last-of-type .films-list__container`);

const films = generateFilms(FILMS_COUNT);
let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
const showingFilms = films.slice(0, showingFilmsCount);
const ratedFilms = films.slice().sort((a, b) => b.rating > a.rating ? 1 : -1).slice(0, FILMS_RATED_COUNT);
const commentedFilms = films.slice().sort((a, b) => b.comments.length > a.comments.length ? 1 : -1).slice(0, FILMS_COMMENTED_COUNT);

const getFilmCardElement = (filmData) => {
  const cardTemplate = createFilmCardTemplate(filmData);
  const cardElement = createTemplateNode(cardTemplate);

  cardElement.addEventListener(`click`, () => {
    const filmDetailsTemplate = createFilmDetailsTemplate(filmData);
    const filmDetailsElement = createTemplateNode(filmDetailsTemplate);
    document.body.appendChild(filmDetailsElement);
    const filmDetailsCloseButton = filmDetailsElement.querySelector(`.film-details__close-btn`);

    filmDetailsCloseButton.addEventListener(`click`, () => filmDetailsElement.remove());
  });

  return cardElement;
};

const renderFilms = (container, filmsData) => {
  filmsData.forEach((filmData) => {
    const filmCard = getFilmCardElement(filmData);
    container.appendChild(filmCard);
  });
};

renderFilms(filmsContainer, showingFilms);
renderFilms(ratedFilmsContainer, ratedFilms);
renderFilms(commentedFilmsContainer, commentedFilms);

if (showingFilmsCount < FILMS_COUNT) {
  render(filmsListElement, createShowMoreButtonTemplate());
  const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

    films.slice(prevFilmsCount, showingFilmsCount)
      .forEach((filmData) => {
        const filmCard = getFilmCardElement(filmData);
        filmsContainer.appendChild(filmCard);
      });

    if (showingFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(siteFooterElement, createFooterStatisticsTemplate());

