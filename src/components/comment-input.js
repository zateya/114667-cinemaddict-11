import AbstractSmartComponent from './abstract-smart-component.js';
import {createEmojiImageMarkup} from '../utils/comments.js';
import {emojiesData} from '../constant.js';

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

const getCurrentEmojiMarkup = (currentEmoji) => {
  if (currentEmoji === ``) {
    return ``;
  }

  const emoji = emojiesData.list.find((it) => it.name === currentEmoji);

  return createEmojiImageMarkup(emoji, emojiesData.sizes.big);
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
  constructor(emoji, comment, onEmojiChange, onCommentInput) {
    super();

    this._emoji = emoji;
    this._comment = comment;
    this._onEmojiChange = onEmojiChange;
    this._onCommentInput = onCommentInput;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createCommentInputTemplate(this._emoji, this._comment);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      this._emoji = evt.target.value;
      this._onEmojiChange(this._emoji);
      this._onCommentInput(this._comment);
      this.rerender();
    });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._comment = evt.target.value;
      this._onCommentInput(this._comment);
    });
  }
}
