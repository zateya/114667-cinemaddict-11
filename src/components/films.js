import {createFilmsListTemplate} from './films-list.js';

const UPCOMING_COUNT = 5;
const RATED_COUNT = 2;
const COMMENTED_COUNT = 2;

const FimlsListData = [
  {
    type: `upcoming`,
    title: `All movies. Upcoming`,
    count: UPCOMING_COUNT
  },
  {
    type: `extra`,
    title: `Top rated`,
    count: RATED_COUNT
  },
  {
    type: `extra`,
    title: `Most commented`,
    count: COMMENTED_COUNT
  }
];

const createFilmsTemplate = () => {
  const filmsTemplate = FimlsListData.reduce((accumulator, currentData) => {
    const currentTemplate = createFilmsListTemplate(currentData);
    accumulator += currentTemplate;

    return accumulator;
  }, ``);

  return (
    `<section class="films">
      ${filmsTemplate}
    </section>`
  );
};

export {createFilmsTemplate};
