import AbstractSmartComponent from "./abstract-smart-component.js";
import {MONTH_NAMES, emojies, POSTER_PATH} from '../constant.js';
import {formatDate} from '../utils/common.js';

const createEmojiImageMarkup = (emoji, size) => {
  const [width, height] = size;
  return `<img src="./${emojies.path}/${emoji}.${emojies.extension}" width="${width}" height="${height}" alt="emoji-${emoji}">`;
};

const createCommentMarkup = (comment) => {
  const {author, date, message, emoji} = comment;
  const formatedDate = formatDate(date);

  const emojiImageMarkup = createEmojiImageMarkup(emoji, emojies.sizes.big);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${emojiImageMarkup}
      </span>
      <div>
        <p class="film-details__comment-text">${message}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsListMarkup = (comments) => comments.map((comment) => createCommentMarkup(comment)).join(`\n`);

const createGenresMarkup = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

const createDetailsMarkup = (details) => details.map(([key, value]) => (
  `<tr class="film-details__row">
    <td class="film-details__term">${key}</td>
    <td class="film-details__cell">${value}</td>
  </tr>`
)).join(`\n`);


const createEmojiListMarkup = () => emojies.list.map((emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    ${createEmojiImageMarkup(emoji, emojies.sizes.small)}
  </label>`
)).join(`\n`);

const createFilmDetailsTemplate = (film, emoji) => {
  const {title, originalTitle, poster, country, genres, rating, director, writers, actors, description, comments, release, duration, isWatchList, isWatched, isFavorite, age} = film;
  const commentsCount = comments.length;
  const releaseDate = `${release.getDate()} ${MONTH_NAMES[release.getMonth()]} ${release.getFullYear()}`;

  const details = [
    [`Director`, director],
    [`Writers`, writers],
    [`Actors`, actors],
    [`Release Date`, releaseDate],
    [`Runtime`, duration],
    [`Country`, country],
    [`Genres`, createGenresMarkup(genres)]
  ];

  const emojiImageMarkup = emoji ? createEmojiImageMarkup(emoji, emojies.sizes.big) : ``;

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

              <p class="film-details__age">${age}</p>
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

              <table class="film-details__table">
                ${createDetailsMarkup(details)}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            ${commentsCount > 0 ? `<ul class="film-details__comments-list">${createCommentsListMarkup(comments)}</ul>` : ``}

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${emojiImageMarkup}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmojiListMarkup()}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._emoji = null;
    this._closeButtonClickHandler = null;
    this._watchListInputChangeHandler = null;
    this._watchedInputChangeHandler = null;
    this._favoriteInputChangeHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._emoji);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._closeButtonClickHandler = handler;
  }

  setWatchListInputChangeHadler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, handler);

    this._watchListInputChangeHandler = handler;
  }

  setWatchedInputChangeHadler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, handler);

    this._watchedInputChangeHandler = handler;
  }

  setFavoriteInputChangeHadler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, handler);

    this._favoriteInputChangeHandler = handler;
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this.setWatchListInputChangeHadler(this._watchListInputChangeHandler);
    this.setWatchedInputChangeHadler(this._watchedInputChangeHandler);
    this.setFavoriteInputChangeHadler(this._favoriteInputChangeHandler);
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const emojiElements = Array.from(element.querySelectorAll(`.film-details__emoji-item`));

    emojiElements.forEach((emojiElement) => {
      emojiElement.addEventListener(`change`, (evt) => {
        this._emoji = evt.target.value;
        this.rerender();
      });
    });
  }
}
