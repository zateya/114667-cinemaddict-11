import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../constant.js";

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterClickHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  getWatchedFilms() {
    return this._films.filter((film) => film.isWatched);
  }

  setRank() {
    const watchedFilmsCount = this.getWatchedFilms().length;

    const rankToCondition = [
      [`novice`, watchedFilmsCount >= 1 && watchedFilmsCount <= 10],
      [`fan`, watchedFilmsCount >= 11 && watchedFilmsCount <= 20],
      [`buff`, watchedFilmsCount >= 21],
    ];

    for (const [rank, condition] of rankToCondition) {
      if (condition) {
        this._rank = rank;
        return;
      }
    }

    this._rank = ``;
  }

  getRank() {
    return this._rank;
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterClickHandlers);
  }

  setFilterClickHandler(handler) {
    this._filterClickHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
