import {emojies, genres} from '../constant.js';
import {formatDuration} from '../utils/common.js';

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

const authors = [
  `Tim Macoveev`,
  `Vadim Makeev`,
  `John Doe`
];

const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `OMG! OMG! OMG!`,
  `Almost two hours? Seriously?`
];

const CommentsCount = {
  MIN: 0,
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

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getRandomFloatNumber = (min, max) => {
  return min + Math.random() * (max - min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomArray = (array) => {
  const count = getRandomIntegerNumber(1, array.length - 1);

  const randomArray = new Array(count)
    .fill(``)
    .map(() => getRandomArrayItem(array));

  return Array.from(new Set(randomArray));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = getRandomIntegerNumber(0, 20000);
  targetDate.setDate(targetDate.getDate() - diffValue);

  return targetDate;
};

const generateDescription = (text, minSentencesCount, maxSentencesCount) => {
  const sentences = text.split(`. `);
  const sentencesCount = getRandomIntegerNumber(minSentencesCount, maxSentencesCount);

  return new Array(sentencesCount)
    .fill(``)
    .map(() => `${getRandomArrayItem(sentences)}.`)
    .join(` `);
};

const getComment = () => {
  return {
    author: getRandomArrayItem(authors),
    date: getRandomDate(),
    message: getRandomArrayItem(comments),
    emoji: getRandomArrayItem(emojies),
  };
};

const getComments = (minCount, maxCount) => {
  const count = getRandomIntegerNumber(minCount, maxCount);

  return new Array(count)
    .fill(``)
    .map(getComment);
};

const generateFilm = () => {
  const hours = getRandomIntegerNumber(0, 4);
  const minutes = getRandomIntegerNumber(0, 59);

  return {
    title: getRandomArrayItem(filmNames),
    originalTitle: getRandomArrayItem(filmNames),
    poster: getRandomArrayItem(posters),
    country: getRandomArrayItem(countries),
    genres: getRandomArray(genres),
    rating: parseFloat(getRandomFloatNumber(5, 10).toFixed(1)),
    director: getRandomArrayItem(directors),
    writers: getRandomArray(writers).join(`, `),
    actors: getRandomArray(actors).join(`, `),
    description: generateDescription(description, DescriptionSentencesCount.MIN, DescriptionSentencesCount.MAX),
    comments: getComments(CommentsCount.MIN, CommentsCount.MAX),
    release: getRandomDate(),
    duration: formatDuration(hours, minutes),
    isWatchList: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    age: getRandomArrayItem(ages)
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

const statisticFilmsCount = getRandomIntegerNumber(100000, 200000);

export {generateFilms, statisticFilmsCount};
