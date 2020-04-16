import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import FilmsComponent from './components/films.js';
import FilmsListComponent from './components/films-list.js';
import FilmCardComponent from './components/film-card.js';
import FilmDetailsComponent from './components/film-details.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render, RenderPosition} from './utils.js';
import {filmLists} from './const.js';
import {generateMenuItems} from './mock/menu.js';
import {generateFilms, statisticFilmsCount} from './mock/film.js';

const FILMS_COUNT = 20;
const FILMS_RATED_COUNT = 2;
const FILMS_COMMENTED_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const renderFilm = (filmContainerElement, film) => {
  const filmCardElement = new FilmCardComponent(film).getElement();

  filmCardElement.addEventListener(`click`, () => {
    const filmDetailsComponent = new FilmDetailsComponent(film);
    const filmDetailsElement = filmDetailsComponent.getElement();
    render(document.body, filmDetailsElement, RenderPosition.BEFOREEND);
    const filmDetailsCloseButton = filmDetailsElement.querySelector(`.film-details__close-btn`);

    filmDetailsCloseButton.addEventListener(`click`, () => {
      filmDetailsElement.remove();
      filmDetailsComponent.removeElement();
    });
  });

  render(filmContainerElement, filmCardElement, RenderPosition.BEFOREEND);
};

const renderFilms = (filmsComponent, films) => {
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  const showingFilms = films.slice(0, showingFilmsCount);
  const ratedFilms = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILMS_RATED_COUNT);
  const commentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_COMMENTED_COUNT);
  const filmsElement = filmsComponent.getElement();

  const renderFilmLists = (...filmsFromLists) => {
    filmLists.map((it, index) => {
      const filmListElement = new FilmsListComponent(it).getElement();
      render(filmsElement, filmListElement, RenderPosition.BEFOREEND);
      const filmContainerElement = filmListElement.querySelector(`.films-list__container`);
      filmsFromLists[index].forEach((film) => renderFilm(filmContainerElement, film));

      const isMoreButtonShown = showingFilmsCount < FILMS_COUNT && index === 0;

      if (isMoreButtonShown) {
        const showMoreButtonComponent = new ShowMoreButtonComponent();
        const showMoreButtonElement = showMoreButtonComponent.getElement();
        render(filmListElement, showMoreButtonElement, RenderPosition.BEFOREEND);

        showMoreButtonElement.addEventListener(`click`, () => {
          const prevFilmsCount = showingFilmsCount;
          showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

          films.slice(prevFilmsCount, showingFilmsCount)
            .forEach((film) => renderFilm(filmContainerElement, film));

          if (showingFilmsCount >= films.length) {
            showMoreButtonElement.remove();
            showMoreButtonComponent.removeElement();
          }
        });
      }
    });
  };

  renderFilmLists(showingFilms, ratedFilms, commentedFilms);
};

const films = generateFilms(FILMS_COUNT);

render(siteHeaderElement, new HeaderProfileComponent().getElement(), RenderPosition.BEFOREEND);

const menuItems = generateMenuItems();
render(siteMainElement, new SiteMenuComponent(menuItems).getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);
renderFilms(filmsComponent, films);

render(siteFooterElement, new FooterStatisticsComponent(statisticFilmsCount).getElement(), RenderPosition.BEFOREEND);

