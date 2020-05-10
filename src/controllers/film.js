import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import CommentsModel from '../models/comments.js';
import CommentsContainerComponent from '../components/comments-container.js';
import CommentsController from './comments.js';
import CommentInputComponent from '../components/comment-input.js';
import {render, replace, remove} from '../utils/render.js';
import {isEscEvent} from '../utils/common.js';
import {FilmControllerMode as Mode, FilmControlType} from "../constant.js";

const bodyElement = document.body;

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._isWatchList = null;
    this._isWatched = null;
    this._isFavorite = null;

    this._commentsModel = new CommentsModel();
    this._commentsController = null;

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
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._commentsModel.setComments(film.comments);

    const commentsContainerComponent = new CommentsContainerComponent();
    const filmDetailsFormElement = this._filmDetailsComponent.getFormElement();
    render(filmDetailsFormElement, commentsContainerComponent);
    const commentsWrapElement = commentsContainerComponent.getCommentsWrapElement();

    this._commentsController = new CommentsController(commentsWrapElement, this._commentsModel, this._onCommentDataChange);
    this._commentsController.render();
    this._commentInputComponent = null;

    this._addListeners();

    this._commentInputComponent = new CommentInputComponent();
    render(commentsWrapElement, this._commentInputComponent);

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  getFilm() {
    return this._film;
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
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchList: !this._film.isWatchList,
    }));
    evt.preventDefault();
  }

  _onWatchedButtonClick(evt) {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched,
    }));
    evt.preventDefault();
  }

  _onFavoriteButtonClick(evt) {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite,
    }));
    evt.preventDefault();
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
        break;
      case FilmControlType.FAVORITE:
        this._isFavorite = !this._isFavorite;
        break;
    }
  }

  _onCommentSubmit() {
    const data = this._filmDetailsComponent.getData();
    if (data.message && data.emoji) {
      this._onCommentDataChange(null, data);
      this._commentInputComponent.reset();
    }
  }

  _onCommentDataChange(oldData, newData) {
    if (oldData === null) {
      this._commentsModel.addComment(newData);
      this._commentsController.updateComments();
    }

    if (newData === null) {
      this._commentsModel.removeComment(oldData.id);
      this._commentsController.updateComments();
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
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchList: this._isWatchList,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      comments: this._commentsModel.getComments(),
    }));
  }

  _hideFilmDetails() {
    bodyElement.removeChild(this._filmDetailsComponent.getElement());
    bodyElement.classList.remove(`hide-overflow`);
    this._mode = Mode.DEFAULT;

    this._rerender();

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      this._hideFilmDetails();
    }
  }
}
