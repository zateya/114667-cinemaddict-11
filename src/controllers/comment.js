
import CommentComponent from '../components/comment.js';
import {render, remove} from '../utils/render.js';

export default class Comment {
  constructor(container, onDataChange) {
    this._container = container;
    this._comment = null;
    this._commentComponent = null;
    this._onDataChange = onDataChange;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  render(comment) {
    this._comment = comment;

    this._commentComponent = new CommentComponent(comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteButtonClickHandler(this._onDeleteButtonClick);
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    this._onDataChange(this._comment, null);
  }

  destroy() {
    remove(this._commentComponent);
  }
}
