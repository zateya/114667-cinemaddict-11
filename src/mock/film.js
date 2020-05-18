import {genres} from '../constant.js';
import {generateComments} from './comments.js';
import {getRandomIntegerNumber, getRandomFloatNumber, getRandomArrayItem, getRandomArray, getRandomDate, generateDescription} from '../utils/random.js';

const filmNames = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Man with the Golden Arm`,
  `The Great Flamarion`,
  `Santa Claus Conquers the Martians`,
  `Made for Each Other`
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `
  + `Cras aliquet varius magna, non porta ligula feugiat eget. `
  + `Fusce tristique felis at fermentum pharetra. `
  + `Aliquam id orci ut lectus varius viverra. `
  + `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `
  + `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `
  + `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `
  + `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. `
  + `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const DescriptionSentencesCount = {
  MIN: 1,
  MAX: 5
};

const ages = [
  `6+`,
  `12+`,
  `18+`
];

const countries = [
  `USA`,
  `Russia`,
  `France`,
  `Germany`
];

const directors = [
  `Anthony Mann`,
  `Heinz Herald`,
  `John Doe`
];

const writers = [
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`
];

const actors = [
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`
];

const CommentsCount = {
  MIN: 0,
  MAX: 5
};

const getComments = () => {
  const commentsCount = getRandomIntegerNumber(CommentsCount.MIN, CommentsCount.MAX);
  return generateComments(commentsCount);
};

const generateFilm = () => {
  const film = {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(filmNames),
    originalTitle: getRandomArrayItem(filmNames),
    poster: getRandomArrayItem(posters),
    genres: getRandomArray(genres),
    rating: parseFloat(getRandomFloatNumber(5, 10).toFixed(1)),
    ageRating: getRandomArrayItem(ages),
    director: getRandomArrayItem(directors),
    writers: getRandomArray(writers),
    actors: getRandomArray(actors),
    release: getRandomDate(0, 10000),
    country: getRandomArrayItem(countries),
    duration: getRandomIntegerNumber(30, 180),
    description: generateDescription(description, DescriptionSentencesCount.MIN, DescriptionSentencesCount.MAX),
    isWatchList: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    comments: getComments(),
  };

  if (film.isWatched) {
    film.watchingDate = getRandomDate(0, 90);
  }

  return film;
};

export const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};
