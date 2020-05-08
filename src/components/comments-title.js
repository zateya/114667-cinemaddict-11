import AbstractComponent from "./abstract-component";

const createCommentsTitleMarkup = (commentsCount) => {
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`;
};

export default class CommentsTitle extends AbstractComponent {
  constructor(commentsCount) {
    super();

    this._commentsCount = commentsCount;
  }

  getTemplate() {
    return createCommentsTitleMarkup(this._commentsCount);
  }
}
