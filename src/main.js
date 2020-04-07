import {createHeaderProfileTemplate} from './components/header-profile.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sorting.js';
import {createFilmsTemplate} from './components/films.js';
import {createFooterStatisticsTemplate} from './components/footer-statistics.js';
import {createFilmDetailsTemplate} from './components/film-details.js';
import {render} from './components/utils.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createHeaderProfileTemplate());
render(siteMainElement, createSiteMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsTemplate());
render(siteFooterElement, createFooterStatisticsTemplate());
render(document.body, createFilmDetailsTemplate());
