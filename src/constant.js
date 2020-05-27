export const AUTHORIZATION = `Basic ol1Ho2981122+erq-po=`;
export const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

export const KeyCode = {
  ESCAPE: 27,
  ENTER: 13
};

export const SHORT_DESCRIPTION_LENGTH = 140;

export const HREF_ID_PREFIX = `#`;

export const HIDDEN_CLASS = `visually-hidden`;

export const STATISTIC_BAR_HEIGHT = 50;

export const FilmsCount = {
  ON_START: 5,
  BY_BUTTON: 5,
  RATED: 2,
  COMMENTED: 2,
};

export const ListType = {
  MAIN: `main`,
  EXTRA: `extra`,
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
  COMMENTED_FILMS: `Most commented`,
};

export const FilmControlType = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`,
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};
export const filterNames = [
  `All Movies`,
  `Watchlist`,
  `History`,
  `Favorites`,
];

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const sortTypes = Object.values(SortType);

export const emojiesData = {
  list: [
    {
      name: `angry`,
      img: `angry.png`,
    },
    {
      name: `puke`,
      img: `puke.png`,
    },
    {
      name: `sleeping`,
      img: `sleeping.png`,
    },
    {
      name: `smile`,
      img: `smile.png`,
    }
  ],
  path: `images/emoji`,
  sizes: {
    big: [55, 55],
    small: [30, 30],
  }
};

export const emojies = emojiesData.list.map((it) => it.name);

export const filmControls = [
  {
    type: `watchlist`,
    name: `Add to watchlist`,
  },
  {
    type: `watched`,
    name: `Already watched`,
  },
  {
    type: `favorite`,
    name: `Add to favorites`,
  }
];

export const users = [
  `Tim Macoveev`,
  `Vadim Makeev`,
  `John Doe`,
  `Ivan Ivanov`,
  `Maxim Petrov`,
];

export const MenuType = {
  STATISTIC: `stats`,
};

export const StatisticPeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

export const statisticFilters = [
  {
    name: `All time`,
    value: `all-time`,
  },
  {
    name: `Today`,
    value: `today`,
  },
  {
    name: `Week`,
    value: `week`,
  },
  {
    name: `Month`,
    value: `month`,
  },
  {
    name: `Year`,
    value: `year`,
  },
];
