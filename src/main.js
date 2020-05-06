import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import FilmsComponent from './components/films.js';
import PageController from './controllers/page.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render} from './utils/render.js';
import FilmsModel from './models/films.js';
import CommentsModel from './models/comments.js';
import {generateFilms} from './mock/film.js';
import {comments} from './mock/comments.js';
import {ALL_FILMS_COUNT} from './constant.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(ALL_FILMS_COUNT);

render(siteHeaderElement, new HeaderProfileComponent());

const siteMenuComponent = new SiteMenuComponent();
render(siteMainElement, siteMenuComponent);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();

commentsModel.setComments(comments);

const filterController = new FilterController(siteMenuComponent.getElement(), filmsModel);
filterController.render();

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent.getElement(), filmsModel, commentsModel);
pageController.render(films);

render(siteFooterElement, new FooterStatisticsComponent(filmsModel.getFilms().length));
