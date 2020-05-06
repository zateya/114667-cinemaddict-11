import SortComponent from '../components/sort.js';
import FilmsListComponent from '../components/films-list.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmController from './film.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import {render, remove} from '../utils/render.js';
import {FilmsCount, FilmsTitle, ListType, SortType} from '../constant.js';

const renderFilms = (filmsContainerElement, films, onDataChange, onViewChange, commentsModel) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainerElement, onDataChange, onViewChange, commentsModel);

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
  constructor(container, filmsModel, commentsModel) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._showingFilmsCount = FilmsCount.ON_START;
    this._showedFilmsControllers = [];
    this._ratedFilmsControllers = [];
    this._commentedFilmsontrollers = [];

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

  render() {
    const container = this._container;

    const mainElement = container.parentElement;
    mainElement.insertBefore(this._sortComponent.getElement(), container);

    const films = this._filmsModel.getFilms();

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
      return;
    }

    const newFilms = this._renderFilmsList(this._filmsListComponent, films.slice(0, this._showingFilmsCount));
    this._filmsListContainer = this._filmsListComponent.getContainer();
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._renderShowMoreButton();

    const isRatedFilms = films.some((it) => it.rating > 0);

    if (isRatedFilms) {
      const ratedFilms = getSortedFilms(films, SortType.RATING, 0, FilmsCount.RATED);
      this._ratedFilmsControllers = this._renderFilmsList(this._ratedListComponent, ratedFilms);
    }

    const isCommentedFilms = films.some((it) => it.comments.length > 0);

    if (isCommentedFilms) {
      const commentedFilms = getSortedFilms(films, SortType.COMMENTS_COUNT, 0, FilmsCount.COMMENTED);
      this._commentedFilmsControllers = this._renderFilmsList(this._commentedListComponent, commentedFilms);
    }
  }

  _renderFilmsList(component, films) {
    render(this._container, component);

    const filmsListContainer = component.getContainer();

    return renderFilms(filmsListContainer, films, this._onDataChange, this._onViewChange, this._commentsModel);
  }

  _renderFilms(films) {
    const newFilms = renderFilms(this._filmsListContainer, films, this._onDataChange, this._onViewChange, this._commentsModel);
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
    const newFilms = renderFilms(this._filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._commentsModel);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);
    const controllerTypes = [this._showedFilmsControllers, this._ratedFilmsControllers, this._commentedFilmsControllers];

    if (isSuccess) {
      const id = oldData.id;

      controllerTypes.forEach((type) => {
        const currentController = type.find((controller) => controller.getFilmCardComponent().getFilm().id === id);

        if (typeof currentController !== `undefined`) {
          currentController.render(newData);
        }
      });
    }
  }

  _onViewChange() {
    const controllers = [...this._showedFilmsControllers, ...this._ratedFilmsControllers, ...this._commentedFilmsControllers];

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
    this._updateFilms(FilmsCount.ON_START);
  }
}
