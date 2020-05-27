export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const getRandomArray = (array, length) => {
  const randomArray = [];

  while (randomArray.length < length) {
    const item = getRandomArrayItem(array);

    if (!randomArray.includes(item)) {
      randomArray.push(item);
    }
  }

  return randomArray;
};
