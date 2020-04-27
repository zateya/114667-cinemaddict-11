import SortComponent from '../components/sort.js';
import FilmsListComponent from '../components/films-list.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmController from './film.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove} from '../utils/render.js';
import {SHOWING_FILMS_COUNT_ON_START, SHOWING_FILMS_COUNT_BY_BUTTON, FILMS_RATED_COUNT, FILMS_COMMENTED_COUNT, filmLists, SortType} from '../constant.js';

const renderFilms = (filmsContainerElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainerElement, onDataChange, onViewChange);

    filmController.render(film);

    return filmController;
  });
};

const renderFilmsList = (container, filmsListComponent, films, onDataChange, onViewChange) => {
  render(container, filmsListComponent);

  const filmsContainerElement = filmsListComponent.getContainer();
  filmsContainerElement.innerHTML = ``;

  return renderFilms(filmsContainerElement, films, onDataChange, onViewChange);
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.release - a.release);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS_COUNT:
      sortedFilms = showingFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._showedFilmsControllers = [];
    this._ratedFilmsControllers = [];
    this._commentedFilmsontrollers = [];

    this._filmsListComponent = new FilmsListComponent(filmLists.all);
    this._filmsRatedListComponent = new FilmsListComponent(filmLists.rated);
    this._filmsCommentedListComponent = new FilmsListComponent(filmLists.commented);

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films) {
    this._films = films;
    const container = this._container.getElement();

    const mainElement = container.parentElement;
    mainElement.insertBefore(this._sortComponent.getElement(), container);

    if (this._films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    const showingFilms = this._films.slice(0, this._showingFilmsCount);
    const newFilms = renderFilmsList(container, this._filmsListComponent, showingFilms, this._onDataChange, this._onViewChange);

    this._renderShowMoreButton();

    const isRatedFilms = this._films.some((it) => it.rating > 0);
    const isCommentedFilms = this._films.some((it) => it.comments.length > 0);

    if (isRatedFilms) {
      const ratedFilms = getSortedFilms(this._films, SortType.RATING, 0, FILMS_RATED_COUNT);
      this._ratedFilmsControllers = renderFilmsList(container, this._filmsRatedListComponent, ratedFilms, this._onDataChange, this._onViewChange);
    }

    if (isCommentedFilms) {
      const commentedFilms = getSortedFilms(this._films, SortType.COMMENTS_COUNT, 0, FILMS_COMMENTED_COUNT);
      this._commentedFilmsControllers = renderFilmsList(container, this._filmsCommentedListComponent, commentedFilms, this._onDataChange, this._onViewChange);
    }

    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    const filmsListElement = this._filmsListComponent.getElement();
    const filmsContainerElement = this._filmsListComponent.getContainer();

    render(filmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    [...this._showedFilmsControllers, ...this._ratedFilmsControllers, ...this._commentedFilmsControllers].forEach((it) => {
      const film = it._filmCardComponent._film;
      if (film === oldData) {
        it.render(newData);
      }
    });
  }

  _onViewChange() {
    [...this._showedFilmsControllers, ...this._ratedFilmsControllers, ...this._commentedFilmsControllers].forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

    const filmsContainerElement = this._filmsListComponent.getContainer();
    filmsContainerElement.innerHTML = ``;

    const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = newFilms;

    this._renderShowMoreButton();
  }
}
