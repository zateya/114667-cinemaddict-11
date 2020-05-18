import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import FilmsComponent from './components/films.js';
import PageController from './controllers/page.js';
import StatisticComponent from './components/statistic.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render} from './utils/render.js';
import FilmsModel from './models/films.js';
import {generateFilms} from './mock/film.js';
import {ALL_FILMS_COUNT, MenuType, FilterType} from './constant.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(ALL_FILMS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
filmsModel.setRank();

render(siteHeaderElement, new HeaderProfileComponent(filmsModel.getRank()));

const siteMenuComponent = new SiteMenuComponent();
render(siteMainElement, siteMenuComponent);

const filterController = new FilterController(siteMenuComponent.getElement(), filmsModel);
filterController.render();

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, filmsModel);
pageController.render();

const statisticComponent = new StatisticComponent(filmsModel);
render(siteMainElement, statisticComponent);
statisticComponent.hide();

render(siteFooterElement, new FooterStatisticsComponent(filmsModel.getFilms().length));

siteMenuComponent.setOnChange((menuType) => {
  switch (menuType) {
    case MenuType.STATISTIC:
      pageController.hide();
      statisticComponent.reset();
      statisticComponent.show();
      filterController.setActiveItem(FilterType.ALL);
      break;

    default:
      statisticComponent.hide();
      pageController.show();
      break;
  }
});
