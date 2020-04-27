export const ESCAPE_KEY_CODE = 27;

export const FILMS_COUNT = 20;
export const SHOWING_FILMS_COUNT_ON_START = 5;
export const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
export const FILMS_RATED_COUNT = 2;
export const FILMS_COMMENTED_COUNT = 2;

export const SHORT_DESCRIPTION_LENGTH = 140;

export const POSTER_PATH = `images/posters`;

export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export const emojies = {
  list: [
    `angry`,
    `puke`,
    `sleeping`,
    `smile`,
  ],
  path: `images/emoji`,
  extension: `png`,
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

export const filmLists = {
  all: {
    type: `all`,
    title: `All movies. Upcoming`
  },
  rated: {
    type: `extra`,
    title: `Top rated`
  },
  commented: {
    type: `extra`,
    title: `Most commented`
  }
};

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
