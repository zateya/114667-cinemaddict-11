import {MONTH_NAMES, emojies} from '../const.js';
import {formatDate, createElement} from '../utils.js';

const createCommentMarkup = (comment) => {
  const {author, date, message, emoji} = comment;
  const formatedDate = formatDate(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
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

const createEmojiListMarkup = () => emojies.map((emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
)).join(`\n`);

const createFilmDetailsTemplate = (film) => {
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

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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

              <!-- похоже на Map, но не придумала как организовать структуру -->
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
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

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

export default class FilmDetails {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
