import AbstractSmartComponent from './abstract-smart-component.js';
import {createEmojiImageMarkup} from '../utils/comments.js';
import {emojies, emojiesData} from '../constant.js';

const createEmojiListMarkup = (currentEmoji) => emojies.map((emoji) => {
  const checkedValue = emoji === currentEmoji ? `checked` : ``;

  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checkedValue}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      ${createEmojiImageMarkup(emoji, emojiesData.sizes.small, emojiesData)}
    </label>`
  );
}).join(`\n`);

const getCurrentEmojiMarkup = (currentEmoji) => {
  if (currentEmoji === ``) {
    return ``;
  }

  return createEmojiImageMarkup(currentEmoji, emojiesData.sizes.big, emojiesData);
};

const createCommentInputTemplate = (emoji, comment) => {
  const emojiImageMarkup = getCurrentEmojiMarkup(emoji);

  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        ${emojiImageMarkup}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input"
        placeholder="Select reaction below and write comment here" name="comment"
        >${comment !== `` ? `${comment}` : ``}</textarea>
      </label>

      <div class="film-details__emoji-list">${createEmojiListMarkup(emoji)}</div>
    </div>`
  );
};

export default class CommentInput extends AbstractSmartComponent {
  constructor() {
    super();

    this._emoji = ``;
    this._comment = ``;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createCommentInputTemplate(this._emoji, this._comment);
  }

  reset() {
    this._emoji = ``;
    this._comment = ``;
    this.rerender();
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

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._comment = evt.target.value;
    });
  }
}
