import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import FilmsComponent from './components/films.js';
import PageController from './controllers/page.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render} from './utils/render.js';
import {generateMenuItems} from './mock/menu.js';
import {generateFilms} from './mock/film.js';
import {FILMS_COUNT} from './constant.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);

render(siteHeaderElement, new HeaderProfileComponent());

const menuItems = generateMenuItems();
render(siteMainElement, new SiteMenuComponent(menuItems));

const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent);
render(siteMainElement, filmsComponent);
pageController.render(films);

render(siteFooterElement, new FooterStatisticsComponent(films.length));
