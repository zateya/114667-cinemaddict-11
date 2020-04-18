import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import FilmsComponent from './components/films.js';
import FilmsListComponent from './components/films-list.js';
import FilmCardComponent from './components/film-card.js';
import FilmDetailsComponent from './components/film-details.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render} from './utils.js';
import {FILM_LISTS} from './const.js';
import {generateMenuItems} from './mock/menu.js';
import {generateFilms, statisticFilmsCount} from './mock/film.js';

const FILMS_COUNT = 20;
const FILMS_RATED_COUNT = 2;
const FILMS_COMMENTED_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const bodyElement = document.body;
const siteHeaderElement = bodyElement.querySelector(`.header`);
const siteMainElement = bodyElement.querySelector(`.main`);
const siteFooterElement = bodyElement.querySelector(`.footer`);

const renderFilmCard = (filmCardContainerElement, film) => {
  const filmCardElement = new FilmCardComponent(film).getElement();
  const filmCardPosterElement = filmCardElement.querySelector(`.film-card__poster`);
  const filmCardTitleElement = filmCardElement.querySelector(`.film-card__title`);
  const filmCardCommentsElement = filmCardElement.querySelector(`.film-card__comments`);

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmDetailsElement = filmDetailsComponent.getElement();
  const filmDetailsCloseButtonElement = filmDetailsElement.querySelector(`.film-details__close-btn`);

  const showFilmDetails = () => {
    bodyElement.appendChild(filmDetailsElement);
    bodyElement.classList.add(`hide-overflow`);
  };

  const hideFilmDetails = () => {
    bodyElement.removeChild(filmDetailsElement);
    bodyElement.classList.remove(`hide-overflow`);
  };

  filmCardPosterElement.addEventListener(`click`, showFilmDetails);
  filmCardTitleElement.addEventListener(`click`, showFilmDetails);
  filmCardCommentsElement.addEventListener(`click`, showFilmDetails);

  filmDetailsCloseButtonElement.addEventListener(`click`, hideFilmDetails);

  render(filmCardContainerElement, filmCardElement);
};

const renderFilms = (filmsComponent, films) => {
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  const showingFilms = films.slice(0, showingFilmsCount);
  const ratedFilms = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILMS_RATED_COUNT);
  const commentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_COMMENTED_COUNT);
  const filmsElement = filmsComponent.getElement();

  const renderFilmList = (listData, listFilms) => {
    const filmListElement = new FilmsListComponent(listData).getElement();
    render(filmsElement, filmListElement);
    const filmCardContainerElement = filmListElement.querySelector(`.films-list__container`);
    listFilms.forEach((film) => renderFilmCard(filmCardContainerElement, film));

    const isMoreButtonShown = listData.type === `all` && showingFilmsCount < FILMS_COUNT;

    if (isMoreButtonShown) {
      const showMoreButtonComponent = new ShowMoreButtonComponent();
      const showMoreButtonElement = showMoreButtonComponent.getElement();
      render(filmListElement, showMoreButtonElement);

      showMoreButtonElement.addEventListener(`click`, () => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

        films.slice(prevFilmsCount, showingFilmsCount)
          .forEach((film) => renderFilmCard(filmCardContainerElement, film));

        if (showingFilmsCount >= films.length) {
          showMoreButtonElement.remove();
          showMoreButtonComponent.removeElement();
        }
      });
    }
  };

  const filmListsToRender = [showingFilms, ratedFilms, commentedFilms];
  FILM_LISTS.map((it, index) => renderFilmList(it, filmListsToRender[index]));
};

const films = generateFilms(FILMS_COUNT);

render(siteHeaderElement, new HeaderProfileComponent().getElement());

const menuItems = generateMenuItems();
render(siteMainElement, new SiteMenuComponent(menuItems).getElement());

render(siteMainElement, new SortComponent().getElement());

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent.getElement());
renderFilms(filmsComponent, films);

render(siteFooterElement, new FooterStatisticsComponent(statisticFilmsCount).getElement());

