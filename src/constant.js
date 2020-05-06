export const ALL_FILMS_COUNT = 20;

export const ESCAPE_KEY_CODE = 27;

export const SHORT_DESCRIPTION_LENGTH = 140;

export const FILTER_HREF_PREFIX = `#`;

export const POSTER_PATH = `images/posters`;

export const FilmsCount = {
  ON_START: 5,
  BY_BUTTON: 5,
  RATED: 2,
  COMMENTED: 2
};

export const ListType = {
  MAIN: `main`,
  EXTRA: `extra`
};

export const FilmControllerMode = {
  DEFAULT: `default`,
  FULL: `full`,
};

export const FilmsTitle = {
  ALL_FILMS: `All movies. Upcoming`,
  NO_FILMS: `There are no movies in our database`,
  LOADING_FILMS: `Loading...`,
  RATED_FILMS: `Top rated`,
  COMMENTED_FILMS: `Most commented`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const filterNames = [
  `All Movies`,
  `Watchlist`,
  `History`,
  `Favorites`
];

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
  COMMENTS_COUNT: `comments`
};

export const sortTypes = [
  `default`,
  `date`,
  `rating`
];

export const emojiesData = {
  list: [
    {
      name: `angry`,
      img: `angry.png`
    },
    {
      name: `puke`,
      img: `puke.png`
    },
    {
      name: `sleeping`,
      img: `sleeping.png`
    },
    {
      name: `smile`,
      img: `smile.png`
    }
  ],
  path: `images/emoji`,
  sizes: {
    big: [55, 55],
    small: [30, 30]
  }
};

export const genres = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
  `Film-Noir`
];

export const filmControls = [
  {
    type: `watchlist`,
    name: `Add to watchlist`
  },
  {
    type: `watched`,
    name: `Already watched`
  },
  {
    type: `favorite`,
    name: `Add to favorites`
  }
];
