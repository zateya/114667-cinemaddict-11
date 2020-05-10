import AbstractComponent from "./abstract-component.js";
import {formatDuration, formateDate, isCtrlEnterEvent} from '../utils/common.js';
import {getRandomArrayItem} from '../utils/random.js';
import {POSTER_PATH, filmControls, users} from '../constant.js';

const createGenresMarkup = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

const createDetailsMarkup = (details) => {

  return (
    `<table class="film-details__table">
      ${details.map(([key, value]) => (
      `<tr class="film-details__row">
        <td class="film-details__term">${key}</td>
        <td class="film-details__cell">${value}</td>
      </tr>`
    )).join(`\n`)}
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
  const {title, originalTitle, poster, genres, rating, ageRating, director, writers, actors, date, country, duration, description, isWatchList, isWatched, isFavorite} = film;

  const releaseDate = formateDate(date);

  const details = [
    [`Director`, director],
    [`Writers`, writers.join(`, `)],
    [`Actors`, actors.join(`, `)],
    [`Release Date`, releaseDate],
    [`Runtime`, formatDuration(duration)],
    [`Country`, country],
    [`Genres`, createGenresMarkup(genres)]
  ];

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
              <img class="film-details__poster-img" src="./${POSTER_PATH}/${poster}" alt="">

              <p class="film-details__age">${ageRating}</p>
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

              ${createDetailsMarkup(details)}

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

const parseFormData = (formData) => {
  return {
    id: String(new Date() + Math.random()),
    author: getRandomArrayItem(users),
    date: new Date(),
    message: formData.get(`comment`),
    emoji: formData.get(`comment-emoji`),
  };
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
    const formData = new FormData(form);

    return parseFormData(formData);
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
