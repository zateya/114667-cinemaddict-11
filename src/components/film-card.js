import AbstractComponent from './abstract-component.js';
import {SHORT_DESCRIPTION_LENGTH} from '../const.js';
import {getShortText} from '../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {title, poster, genres, rating, description, comments, release, duration, isWatchList, isWatched, isFavorite} = film;

  const shortDescription = getShortText(description, SHORT_DESCRIPTION_LENGTH);
  const isWatchListClass = isWatchList ? `film-card__controls-item--active` : ``;
  const isWatchedClass = isWatched ? `film-card__controls-item--active` : ``;
  const isFavoriteClass = isFavorite ? `film-card__controls-item--active` : ``;
  const commentsCount = comments.length;
  const releaseYear = release.getFullYear();

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} ${commentsCount === 1 ? `comment` : `comments`}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchListClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }
}
