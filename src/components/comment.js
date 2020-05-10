import AbstractComponent from './abstract-component.js';
import {formatCommentDate} from '../utils/common.js';
import {createEmojiImageMarkup} from '../utils/comments.js';
import {emojiesData} from '../constant.js';
import {encode} from "he";

const createCommentMarkup = (comment) => {
  const {author, date, message: notSanitizedMessage, emoji} = comment;
  const formatedDate = formatCommentDate(date);

  const message = encode(notSanitizedMessage);

  const emojiImageMarkup = createEmojiImageMarkup(emoji, emojiesData.sizes.big, emojiesData);

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

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();

    this._comment = comment;
  }

  getTemplate() {
    return createCommentMarkup(this._comment);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, handler);
  }
}
