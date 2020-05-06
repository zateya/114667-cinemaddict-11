import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmCommentsComponent from '../components/comments.js';
import {render, replace, remove} from '../utils/render.js';
import {ESCAPE_KEY_CODE, FilmControllerMode as Mode} from "../constant.js";
import {getCommentsByFilm} from '../utils/comments.js';

const bodyElement = document.body;

export default class FilmController {
  constructor(container, onDataChange, onViewChange, commentsModel) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._filmCommentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    const filmComments = getCommentsByFilm(film, this._commentsModel.getComments());

    this._filmCommentsComponent = new FilmCommentsComponent(filmComments);
    render(this._filmDetailsComponent.getElement().querySelector(`form`), this._filmCommentsComponent);

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

    this._filmCardComponent.setWatchlistButtonClickHadler((evt) => {
      evt.preventDefault();
      addFilmToWatchList();
    });

    this._filmCardComponent.setWatchedButtonClickHadler((evt) => {
      evt.preventDefault();
      addFilmToWatched();
    });

    this._filmCardComponent.setFavoriteButtonClickHadler((evt) => {
      evt.preventDefault();
      addFilmToFavorite();
    });

    this._filmDetailsComponent.setWatchListInputChangeHadler(addFilmToWatchList);
    this._filmDetailsComponent.setWatchedInputChangeHadler(addFilmToWatched);
    this._filmDetailsComponent.setFavoriteInputChangeHadler(addFilmToFavorite);

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
