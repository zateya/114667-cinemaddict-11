import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmModel from '../models/film.js';
import CommentsModel from '../models/comments.js';
import CommentModel from "../models/comment.js";
import CommentsContainerComponent from '../components/comments-container.js';
import CommentsController from './comments.js';
import CommentInputComponent from '../components/comment-input.js';
import {render, replace, remove} from '../utils/render.js';
import {isEscEvent} from '../utils/common.js';
import {FilmControllerMode as Mode, FilmControlType} from "../constant.js";

const bodyElement = document.body;

const parseFormData = (formData) => {
  return new CommentModel({
    comment: formData.get(`comment`),
    date: new Date(),
    emotion: formData.get(`comment-emoji`),
  });
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._api = api;
    this._film = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._isWatchList = null;
    this._isWatched = null;
    this._isFavorite = null;
    this._watchingDate = null;

    this._commentsModel = new CommentsModel();
    this._commentsController = null;
    this._commentInputComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCommentDataChange = this._onCommentDataChange.bind(this);

    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._onWatchListButtonClick = this._onWatchListButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
    this._onFavoriteButtonClick = this._onFavoriteButtonClick.bind(this);
    this._onFilmDetailsControlsChange = this._onFilmDetailsControlsChange.bind(this);
    this._hideFilmDetails = this._hideFilmDetails.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);
  }

  render(film) {
    this._film = film;

    this._isWatchList = film.isWatchList;
    this._watchingDate = film.watchingDate;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._renderComments();
    this._addListeners();

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  getId() {
    return this._film.id;
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

  _renderComments() {
    const filmDetailsFormElement = this._filmDetailsComponent.getFormElement();
    const commentsContainerComponent = new CommentsContainerComponent();

    const commentsWrapElement = commentsContainerComponent.getCommentsWrapElement();
    this._commentInputComponent = new CommentInputComponent();

    this._api.getComments(this._film.id)
    .then((comments) => {
      render(filmDetailsFormElement, commentsContainerComponent);
      this._commentsModel.setComments(comments);
      this._commentsController = new CommentsController(commentsWrapElement, this._commentsModel, this._onCommentDataChange);
      this._commentsController.render();
    });

    render(commentsWrapElement, this._commentInputComponent);
  }

  _addListeners() {
    this._filmCardComponent.setClickHandler(this._showFilmDetails);
    this._filmCardComponent.setWatchlistButtonClickHandler(this._onWatchListButtonClick);
    this._filmCardComponent.setWatchedButtonClickHandler(this._onWatchedButtonClick);
    this._filmCardComponent.setFavoriteButtonClickHandler(this._onFavoriteButtonClick);
    this._filmDetailsComponent.setControlInputsChangeHadler(this._onFilmDetailsControlsChange);
    this._filmDetailsComponent.setCloseButtonClickHandler(this._hideFilmDetails);
    this._filmDetailsComponent.setSubmitHandler(this._onCommentSubmit);
  }

  _onWatchListButtonClick(evt) {
    evt.preventDefault();

    const newFilm = FilmModel.clone(this._film);
    newFilm.isWatchList = !newFilm.isWatchList;

    this._onDataChange(this._film, newFilm);
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();

    const newFilm = FilmModel.clone(this._film);
    newFilm.isWatched = !newFilm.isWatched;
    newFilm.watchingDate = newFilm.isWatched ? new Date() : null;

    this._onDataChange(this._film, newFilm);
  }

  _onFavoriteButtonClick(evt) {
    evt.preventDefault();

    const newFilm = FilmModel.clone(this._film);
    newFilm.isFavorite = !newFilm.isFavorite;

    this._onDataChange(this._film, newFilm);
  }

  _onFilmDetailsControlsChange(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const controlType = evt.target.id;

    switch (controlType) {
      case FilmControlType.WATCHLIST:
        this._isWatchList = !this._isWatchList;
        break;
      case FilmControlType.WATCHED:
        this._isWatched = !this._isWatched;
        this._watchingDate = this._isWatched ? new Date() : null;
        break;
      case FilmControlType.FAVORITE:
        this._isFavorite = !this._isFavorite;
        break;
    }
  }

  _onCommentSubmit() {
    const formData = this._filmDetailsComponent.getData();
    const data = parseFormData(formData);

    if (data.message && data.emoji) {
      this._onCommentDataChange(null, data);
      this._commentInputComponent.reset();
    }
  }

  _onCommentDataChange(oldData, newData) {
    if (oldData === null) {
      this._api.createComment(newData, this._film.id)
        .then((comments) => {
          this._commentsModel.setComments(comments);
          this._commentsController.updateComments();
        })
        .catch(() => {
          this._commentsController.shake();
        });
    }

    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then(() => {
          this._commentsModel.removeComment(oldData.id);
          this._commentsController.updateComments();
        })
        .catch(() => {
          this._commentsController.shake();
        });
    }
  }

  _showFilmDetails() {
    this._onViewChange();
    bodyElement.appendChild(this._filmDetailsComponent.getElement());
    bodyElement.classList.add(`hide-overflow`);
    this._mode = Mode.FULL;

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _rerender() {
    const newFilm = FilmModel.clone(this._film);

    newFilm.isWatchList = this._isWatchList;
    newFilm.isWatched = this._isWatched;
    newFilm.watchingDate = this._watchingDate;
    newFilm.isFavorite = this._isFavorite;
    newFilm.comments = this._commentsModel.getIds();
    this._onDataChange(this._film, newFilm);
  }

  _hideFilmDetails() {
    bodyElement.removeChild(this._filmDetailsComponent.getElement());
    bodyElement.classList.remove(`hide-overflow`);

    this._rerender();

    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      this._hideFilmDetails();
    }
  }
}
