import CommentsTitleComponent from '../components/comments-title.js';
import CommentsListComponent from '../components/comments-list.js';
import CommentController from '../controllers/comment.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const renderComments = (container, comments, onDataChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(container, onDataChange);
    commentController.render(comment);

    return commentController;
  });
};

export default class CommentsController {
  constructor(container, commentsModel, onDataChange) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentsTitleComponent = new CommentsTitleComponent(this._commentsModel.getComments().length);
    this._commentListComponent = new CommentsListComponent();
    this._commentsControllers = [];
    this._showingCommentsCount = 0;

    this._onDataChange = onDataChange;
  }

  render() {
    const container = this._container;

    render(container, this._commentListComponent, RenderPosition.AFTERBEGIN);
    render(container, this._commentsTitleComponent, RenderPosition.AFTERBEGIN);

    this._renderComments();
  }

  _removeComments() {
    this._commentsControllers.forEach((commentController) => commentController.destroy());
    this._commentsControllers = [];
  }

  _renderComments() {
    this._removeComments();
    const commentsListElement = this._commentListComponent.getElement();
    const sortedComments = this._commentsModel.getComments().slice().sort((a, b) => b.date - a.date);
    this._commentsControllers = renderComments(commentsListElement, sortedComments, this._onDataChange);
    this._showingCommentsCount = this._commentsControllers.length;
  }

  _updateCommentsTitle() {
    const oldTitle = this._commentsTitleComponent;
    const newTitle = new CommentsTitleComponent(this._commentsModel.getComments().length);
    replace(newTitle, oldTitle);
    this._commentsTitleComponent = newTitle;
  }

  updateComments() {
    if (this._commentsModel.getComments().length > 0 && this._showingCommentsCount === 0) {
      render(this._commentsTitleComponent.getElement(), this._commentListComponent, RenderPosition.AFTEREND);
    }

    this._renderComments();
    this._updateCommentsTitle();

    if (this._showingCommentsCount === 0) {
      remove(this._commentListComponent);
    }
  }
}
