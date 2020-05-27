import SortComponent from '../components/sort.js';
import FilmsListComponent from '../components/films-list.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmController from './film.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {FilmsCount, FilmsTitle, ListType, SortType, FilterType} from '../constant.js';
import {getRandomArray} from '../utils/random.js';

const renderFilms = (filmsContainerElement, films, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainerElement, onDataChange, onViewChange, api);

    filmController.render(film);

    return filmController;
  });
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
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

const getTopRatedFilms = (films, count) => {
  const sortedFilms = films.slice().sort((a, b) => b.rating - a.rating);
  const firstFilmRating = sortedFilms[0].rating;

  if (firstFilmRating === 0) {
    return [];
  }

  const allTopRatedFilms = sortedFilms.filter((film) => film.rating === firstFilmRating);

  if (allTopRatedFilms.length >= count) {
    return getRandomArray(allTopRatedFilms, count);
  }

  return sortedFilms.slice(0, count);
};

const getMostCommentedFilms = (films, count) => {
  const sortedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length);
  const firstFilmCommentsCount = sortedFilms[0].comments.length;

  if (firstFilmCommentsCount === 0) {
    return [];
  }

  const allMostCommentedFilms = sortedFilms.filter((film) => film.comments.length === firstFilmCommentsCount);

  if (allMostCommentedFilms.length >= count) {
    return getRandomArray(allMostCommentedFilms, count);
  }

  return sortedFilms.slice(0, count);
};

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._api = api;
    this._showingFilmsCount = FilmsCount.ON_START;
    this._showedFilmsControllers = [];
    this._ratedFilmsControllers = [];
    this._commentedFilmsControllers = [];

    this._filmsListComponent = new FilmsListComponent(FilmsTitle.ALL_FILMS, {isTitleHidden: true});
    this._ratedListComponent = new FilmsListComponent(FilmsTitle.RATED_FILMS, {type: ListType.EXTRA});
    this._commentedListComponent = new FilmsListComponent(FilmsTitle.COMMENTED_FILMS, {type: ListType.EXTRA});

    this._filmsListContainer = null;

    this._sortComponent = new SortComponent();
    this._noFilmsComponent = new NoFilmsComponent(FilmsTitle.NO_FILMS);
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._onFilterClick = this._onFilterClick.bind(this);
    this._filmsModel.setFilterClickHandler(this._onFilterClick);
  }

  hide() {
    this._container.hide();
    this._sortComponent.hide();
    this._reset();
  }

  show() {
    this._container.show();
    this._sortComponent.show();
  }

  render() {
    const container = this._container.getElement();

    render(container, this._sortComponent, RenderPosition.BEFOREBEGIN);

    const films = this._filmsModel.getFilms();

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    const newFilms = this._renderFilmsList(this._filmsListComponent, films.slice(0, this._showingFilmsCount));
    this._filmsListContainer = this._filmsListComponent.getContainer();
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._renderShowMoreButton();

    const ratedFilms = getTopRatedFilms(films, FilmsCount.RATED);

    if (ratedFilms.length > 0) {
      this._ratedFilmsControllers = this._renderFilmsList(this._ratedListComponent, ratedFilms);
    }

    const commentedFilms = getMostCommentedFilms(films, FilmsCount.COMMENTED);

    if (commentedFilms.length > 0) {
      this._commentedFilmsControllers = this._renderFilmsList(this._commentedListComponent, commentedFilms);
    }
  }

  _renderFilmsList(component, films) {
    render(this._container.getElement(), component);

    const filmsListContainer = component.getContainer();

    return renderFilms(filmsListContainer, films, this._onDataChange, this._onViewChange, this._api);
  }

  _renderFilms(films) {
    const newFilms = renderFilms(this._filmsListContainer, films, this._onDataChange, this._onViewChange, this._api);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    this._showingFilmsCount = this._showedFilmsControllers.length;
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmsControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    const filmsListElement = this._filmsListComponent.getElement();

    render(filmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    const films = this._filmsModel.getFilms();
    this._showingFilmsCount += FilmsCount.BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
    const newFilms = renderFilms(this._filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._api);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderControllerNewData(controllerType, filmId, filmModel) {
    const currentController = controllerType.find((controller) => controller.getId() === filmId);

    if (typeof currentController === `undefined`) {
      return;
    }

    currentController.render(filmModel);
  }

  _onDataChange(oldData, newData) {
    const controllerTypes = [this._showedFilmsControllers, this._ratedFilmsControllers, this._commentedFilmsControllers];

    this._api.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

        if (isSuccess) {
          controllerTypes.forEach((type) => this._renderControllerNewData(type, oldData.id, filmModel));
          this._updateFilms(this._showingFilmsCount);
        }
      });
  }

  _onViewChange() {
    const controllers = this._showedFilmsControllers.concat(this._ratedFilmsControllers, this._commentedFilmsControllers);

    controllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = FilmsCount.ON_START;
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _onFilterClick() {
    this._showingFilmsCount = FilmsCount.ON_START;
    this._sortComponent.reset();
    this._updateFilms(this._showingFilmsCount);
  }

  _reset() {
    this._filmsModel.setFilter(FilterType.ALL);
    this._sortComponent.reset();
  }
}
