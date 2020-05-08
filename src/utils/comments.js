import {emojiesData} from '../constant.js';

export const createEmojiImageMarkup = (emoji, size) => {
  const {name, img} = emoji;
  const [width, height] = size;

  return `<img src="./${emojiesData.path}/${img}" width="${width}" height="${height}" alt="emoji-${name}">`;
};
