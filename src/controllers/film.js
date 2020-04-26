import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import {render, replace} from '../utils/render.js';
import {ESCAPE_KEY_CODE} from "../constant.js";

const bodyElement = document.body;

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._film = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._filmCardComponent.setClickHandler(() => {
      this._showFilmDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setWatchlistButtonClickHadler((evt) => {
      evt.preventDefault();
      this._addFilmToWatchList();
    });

    this._filmCardComponent.setWatchedButtonClickHadler((evt) => {
      evt.preventDefault();
      this._addFilmToWatched();
    });

    this._filmCardComponent.setFavoriteButtonClickHadler((evt) => {
      evt.preventDefault();
      this._addFilmToFavorite();
    });

    this._filmDetailsComponent.setWatchListInputChangeHadler(() => {
      this._addFilmToWatchList();
    });

    this._filmDetailsComponent.setWatchedInputChangeHadler(() => {
      this._addFilmToWatched();
    });

    this._filmDetailsComponent.setFavoriteInputChangeHadler(() => {
      this._addFilmToFavorite();
    });

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

  get filmCardComponent() {
    return this._filmCardComponent;
  }

  _addFilmToWatchList() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchList: !this._film.isWatchList,
    }));
  }

  _addFilmToWatched() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched,
    }));
  }

  _addFilmToFavorite() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite,
    }));
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
    this._mode = Mode.EDIT;
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
