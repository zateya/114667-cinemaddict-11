import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import CommentsContainerComponent from '../components/comments-container.js';
import CommentsTitleComponent from '../components/comments-title.js';
import CommentsListComponent from '../components/comments-list.js';
import CommentInputComponent from '../components/comment-input.js';
import CommentController from '../controllers/comment.js';
import CommentsModel from '../models/comments.js';
import {render, replace, remove} from '../utils/render.js';
import {ESCAPE_KEY_CODE, FilmControllerMode as Mode} from "../constant.js";

const bodyElement = document.body;

const renderComments = (container, comments, onCommentDataChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(container, onCommentDataChange);
    commentController.render(comment);

    return commentController;
  });
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._commentsModel = new CommentsModel();
    this._commentsWrapElement = null;
    this._commentsTitleComponent = null;
    this._commentListComponent = new CommentsListComponent();
    this._commentsControllers = [];
    this._showingCommentsCount = 0;

    this._emoji = ``;
    this._comment = ``;
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onCommentInput = this._onCommentInput.bind(this);
    this._onCommentDataChange = this._onCommentDataChange.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._commentsModel.setComments(film.comments);

    const commentsContainerComponent = new CommentsContainerComponent();
    const filmDetailsFormElement = this._filmDetailsComponent.getFormElement();
    render(filmDetailsFormElement, commentsContainerComponent);
    this._commentsWrapElement = commentsContainerComponent.getCommentsWrapElement();

    this._commentsTitleComponent = new CommentsTitleComponent(this._commentsModel.getComments().length);
    render(this._commentsWrapElement, this._commentsTitleComponent);

    render(this._commentsWrapElement, this._commentListComponent);

    this._renderComments();

    const commentInputComponent = new CommentInputComponent(this._emoji, this._comment, this._onEmojiChange, this._onCommentInput);
    render(this._commentsWrapElement, commentInputComponent);

    this._filmCardComponent.setClickHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    const addFilmToWatchList = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isWatchList: !film.isWatchList,
      }));
    };

    const addFilmToWatched = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    };

    const addFilmToFavorite = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    };

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      addFilmToWatchList();
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      addFilmToWatched();
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      addFilmToFavorite();
    });

    this._filmDetailsComponent.setWatchListInputChangeHandler(addFilmToWatchList);
    this._filmDetailsComponent.setWatchedInputChangeHandler(addFilmToWatched);
    this._filmDetailsComponent.setFavoriteInputChangeHandler(addFilmToFavorite);

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._hideFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  getFilmCardComponent() {
    return this._filmCardComponent;
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideFilmDetails();
    }
  }

  _onEmojiChange(emoji) {
    this._emoji = emoji;
  }

  _onCommentInput(comment) {
    this._comment = comment;
  }

  _removeComments() {
    this._commentsControllers.forEach((commentController) => commentController.destroy());
    this._commentsControllers = [];
  }

  _renderComments() {
    this._removeComments();
    const commentsListElement = this._commentListComponent.getElement();
    this._commentsControllers = renderComments(commentsListElement, this._commentsModel.getComments(), this._onCommentDataChange);
    this._showingCommentsCount = this._commentsControllers.length;
  }

  _updateCommentsTitle() {
    const oldTitle = this._commentsTitleComponent;
    const newTitle = new CommentsTitleComponent(this._commentsModel.getComments().length);
    replace(newTitle, oldTitle);
    this._commentsTitleComponent = newTitle;
  }

  _updateComments() {
    if (this._commentsControllers.length > 0 && this._showingCommentsCount === 0) {
      render(this._commentsWrapElement, this._commentListComponent);
    }

    this._renderComments();
    this._updateCommentsTitle();

    if (this._showingCommentsCount === 0) {
      remove(this._commentListComponent);
    }
  }

  _onCommentDataChange(commentController, oldData, newData) {
    if (oldData === null) {
      this._commentsModel.addComment(newData);
      this._updateComments();
    }

    if (newData === null) {
      this._commentsModel.removeComment(oldData.id);
      this._updateComments();
    }
  }

  _showFilmDetails() {
    this._onViewChange();
    bodyElement.appendChild(this._filmDetailsComponent.getElement());
    bodyElement.classList.add(`hide-overflow`);
    this._mode = Mode.FULL;
  }

  _hideFilmDetails() {
    bodyElement.removeChild(this._filmDetailsComponent.getElement());
    bodyElement.classList.remove(`hide-overflow`);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.keyCode === ESCAPE_KEY_CODE) {
      this._hideFilmDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
