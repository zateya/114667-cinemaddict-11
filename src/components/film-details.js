import AbstractComponent from "./abstract-component.js";
import {formatDuration, formateDate, isCtrlEnterEvent} from '../utils/common.js';
import {filmControls} from '../constant.js';

const createGenresMarkup = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre.trim()}</span>`).join(`\n`);

const createDetailMarkup = ([key, value]) => {
  if (value.length === 0) {
    return ``;
  }

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${key}</td>
      <td class="film-details__cell">${value}</td>
    </tr>`
  );
};

const createDetailsMarkup = (details) => {
  const detailsMarkup = details.map((detail) => createDetailMarkup(detail)).join(`\n`);

  if (detailsMarkup.length === 0) {
    return ``;
  }

  return (
    `<table class="film-details__table">
      ${detailsMarkup}
    </table>`
  );
};

const createControlItemMarkup = (control, isChecked) => {
  const {type, name} = control;

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${type}" name="${type}" ${isChecked ? `checked` : ``}>
    <label for="${type}" class="film-details__control-label film-details__control-label--${type}">${name}</label>`
  );
};

const createControlsMarkup = (...params) => {
  const controlMarkup = filmControls.map((control, i) => createControlItemMarkup(control, params[i])).join(`\n`);

  return (
    `<section class="film-details__controls">
      ${controlMarkup}
    </section>`
  );
};

const createFilmDetailsTemplate = (film) => {
  const {title, originalTitle, poster, genres, rating, ageRating, director, writers, actors, release, country, duration, description, isWatchList, isWatched, isFavorite} = film;

  const genresTitle = genres.length > 1 ? `Genres` : `Genre`;

  const details = [
    [`Director`, director.trim()],
    [`Writers`, writers.map((writer) => writer.trim()).join(`, `)],
    [`Actors`, actors.map((actor) => actor.trim()).join(`, `)],
    [`Release Date`, formateDate(release)],
    [`Runtime`, formatDuration(duration)],
    [`Country`, country.trim()],
    [genresTitle, createGenresMarkup(genres)]
  ];

  const detailsMarkup = createDetailsMarkup(details);

  const controlsMarkup = createControlsMarkup(isWatchList, isWatched, isFavorite);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="/${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              ${detailsMarkup}

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          ${controlsMarkup}
        </div>

      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);

    return new FormData(form);
  }

  setSubmitHandler(handler) {
    const form = this.getElement().querySelector(`.film-details__inner`);

    form.addEventListener(`keydown`, (evt) => {
      if (isCtrlEnterEvent(evt)) {
        handler();
      }
    });
  }

  getFormElement() {
    return this.getElement().querySelector(`form`);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  setControlInputsChangeHadler(handler) {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, handler);
  }
}
