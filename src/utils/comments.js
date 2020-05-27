export const createEmojiImageMarkup = (emoji, size, emojiesData) => {
  const [width, height] = size;
  const img = emojiesData.list.find((it) => it.name === emoji).img;

  return `<img src="./${emojiesData.path}/${img}" width="${width}" height="${height}" alt="emoji-${emoji}">`;
};
