
import {getRandomArrayItem, getRandomDate} from './utils.js';
import {emojiesData} from '../constant.js';

const ALL_COMMENTS_COUNT = 20;

const authors = [
  `Tim Macoveev`,
  `Vadim Makeev`,
  `John Doe`
];

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
    author: getRandomArrayItem(authors),
    date: getRandomDate(0, 10),
    message: getRandomArrayItem(messages),
    emoji: getRandomArrayItem(emojiesData.list),
  };
};

export const comments = new Array(ALL_COMMENTS_COUNT).fill(``).map(getComment);
