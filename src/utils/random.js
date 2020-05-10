export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomFloatNumber = (min, max) => {
  return min + Math.random() * (max - min);
};

export const getRandomArray = (array) => {
  const count = getRandomIntegerNumber(1, array.length - 1);

  const randomArray = new Array(count)
    .fill(``)
    .map(() => getRandomArrayItem(array));

  return Array.from(new Set(randomArray));
};

export const getRandomDate = (minDiff, maxDiff) => {
  const targetDate = new Date();
  const diffValue = getRandomIntegerNumber(minDiff, maxDiff);
  targetDate.setDate(targetDate.getDate() - diffValue);

  return targetDate;
};

export const generateDescription = (text, minSentencesCount, maxSentencesCount) => {
  const sentences = text.split(`. `);
  const sentencesCount = getRandomIntegerNumber(minSentencesCount, maxSentencesCount);

  return new Array(sentencesCount)
    .fill(``)
    .map(() => `${getRandomArrayItem(sentences)}.`)
    .join(` `);
};
