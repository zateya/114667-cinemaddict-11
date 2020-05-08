
import CommentComponent from '../components/comment.js';
import {render, remove} from '../utils/render.js';

export default class Comment {
  constructor(container, onCommentDataChange) {
    this._container = container;
    this._commentComponent = null;
    this._onCommentDataChange = onCommentDataChange;
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onCommentDataChange(this, comment, null);
    });
  }

  destroy() {
    remove(this._commentComponent);
  }
}
