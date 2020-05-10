
import {getRandomArrayItem, getRandomDate} from '../utils/random.js';
import {emojies, users} from '../constant.js';

const messages = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `OMG! OMG! OMG!`,
  `Almost two hours? Seriously?`
];

const getComment = () => {
  return {
    id: String(new Date() + Math.random()),
    author: getRandomArrayItem(users),
    date: getRandomDate(0, 10),
    message: getRandomArrayItem(messages),
    emoji: getRandomArrayItem(emojies),
  };
};

export const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(getComment);
};
