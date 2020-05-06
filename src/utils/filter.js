import {FilterType} from '../constant.js';

export const getWatchListFilms = (tasks) => {
  return tasks.filter((task) => task.isWatchList);
};

export const getHistoryFilms = (tasks) => {
  return tasks.filter((task) => task.isWatched);
};

export const getFavoritesFilms = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchListFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }

  return films;
};
