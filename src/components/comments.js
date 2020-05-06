import AbstractSmartComponent from './abstract-smart-component.js';
import {formatCommentDate} from '../utils/common.js';
import {emojiesData} from '../constant.js';

const createEmojiImageMarkup = (emoji, size) => {
  const {name, img} = emoji;
  const [width, height] = size;

  return `<img src="./${emojiesData.path}/${img}" width="${width}" height="${height}" alt="emoji-${name}">`;
};

const createEmojiListMarkup = (currentEmoji) => emojiesData.list.map((emoji) => {
  const {name} = emoji;
  const checkedValue = name === currentEmoji ? `checked` : ``;

  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${name}" value="${name}" ${checkedValue}>
    <label class="film-details__emoji-label" for="emoji-${name}">
      ${createEmojiImageMarkup(emoji, emojiesData.sizes.small)}
    </label>`
  );
}).join(`\n`);

const createCommentMarkup = (comment) => {
  const {author, date, message, emoji} = comment;
  const formatedDate = formatCommentDate(date);

  const emojiImageMarkup = createEmojiImageMarkup(emoji, emojiesData.sizes.big);

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

const getCurrentEmojiMarkup = (currentEmoji) => {
  if (currentEmoji === null) {
    return ``;
  }

  const emoji = emojiesData.list.find((it) => it.name === currentEmoji);

  return createEmojiImageMarkup(emoji, emojiesData.sizes.big);
};

const createCommentsTemplate = (comments, currentEmoji) => {
  const commentsCount = comments.length;

  const emojiImageMarkup = getCurrentEmojiMarkup(currentEmoji);

  return (
    `<div class="form-details__bottom-container">
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

          <div class="film-details__emoji-list">${createEmojiListMarkup(currentEmoji)}</div>
        </div>
      </section>
    </div>`
  );
};

export default class Comments extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;
    this._emoji = null;
    this.deleteButtonClickHandler = null;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setDeleleButtonClickHandler(this.deleteButtonClickHandler);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._emoji);
  }

  setDeleleButtonClickHandler(handler) {
    const deleteButtons = Array.from(this.getElement().querySelectorAll(`.film-details__comment-delete`));

    deleteButtons.forEach((button) => {
      button.addEventListener(`click`, handler);

      this.deleteButtonClickHandler = handler;
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      this._emoji = evt.target.value;
      this.rerender();
    });
  }
}
