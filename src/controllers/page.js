import FilmsListComponent from '../components/films-list.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove} from '../utils/render.js';
import {SHOWING_FILMS_COUNT_ON_START, SHOWING_FILMS_COUNT_BY_BUTTON, FILMS_RATED_COUNT, FILMS_COMMENTED_COUNT, FILM_LISTS} from '../constant.js';

const renderFilmCard = (filmsListContainerElement, film) => {
  const bodyElement = document.body;
  const filmCardComponent = new FilmCardComponent(film);

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmDetailsElement = filmDetailsComponent.getElement();

  const showFilmDetails = () => {
    bodyElement.appendChild(filmDetailsElement);
    bodyElement.classList.add(`hide-overflow`);
  };

  const hideFilmDetails = () => {
    bodyElement.removeChild(filmDetailsElement);
    bodyElement.classList.remove(`hide-overflow`);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      hideFilmDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmCardComponent.setClickHandler(() => {
    showFilmDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  filmDetailsComponent.setCloseButtonClickHandler(() => {
    hideFilmDetails();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(filmsListContainerElement, filmCardComponent);
};

const renderFilms = (filmsListContainerElement, films) => {
  films.forEach((film) => renderFilmCard(filmsListContainerElement, film));
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const renderShowMoreButton = () => {
      if (showingFilmsCount >= films.length) {
        return;
      }

      const filmsListElement = container.querySelector(`.films-list`);
      const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

      render(filmsListElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

        renderFilms(filmsListContainerElement, films.slice(prevFilmsCount, showingFilmsCount));

        if (showingFilmsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const renderFilmList = (listData, listFilms) => {
      const filmsListComponent = new FilmsListComponent(listData);
      render(container, filmsListComponent);

      const filmsListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);
      renderFilms(filmsListContainerElement, listFilms);

      if (listData.type !== `all`) {
        return;
      }

      renderShowMoreButton();
    };

    const container = this._container.getElement();

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const showingFilms = films.slice(0, showingFilmsCount);
    const ratedFilms = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILMS_RATED_COUNT);
    const commentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_COMMENTED_COUNT);

    const filmListsToRender = [showingFilms, ratedFilms, commentedFilms];
    FILM_LISTS.map((it, i) => renderFilmList(it, filmListsToRender[i]));
  }
}
