import API from "./api/index.js";
import HeaderProfileComponent from './components/header-profile.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterController from './controllers/filter.js';
import FilmsComponent from './components/films.js';
import NoFilmsComponent from './components/no-films.js';
import PageController from './controllers/page.js';
import StatisticComponent from './components/statistic.js';
import FooterStatisticsComponent from './components/footer-statistics.js';
import {render} from './utils/render.js';
import FilmsModel from './models/films.js';
import {AUTHORIZATION, END_POINT, MenuType, FilmsTitle, FilterType} from './constant.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteMenuComponent.getElement(), filmsModel);
const filmsComponent = new FilmsComponent();
const noFilmsComponent = new NoFilmsComponent(FilmsTitle.LOADING_FILMS);
const pageController = new PageController(filmsComponent, filmsModel, api);
const statisticComponent = new StatisticComponent(filmsModel);

render(siteMainElement, siteMenuComponent);
filterController.render();
render(siteMainElement, noFilmsComponent);
render(siteMainElement, filmsComponent);
render(siteMainElement, statisticComponent);

statisticComponent.hide();

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

api.getFilms()
  .then((films) => {
    noFilmsComponent.hide();
    filmsModel.setFilms(films);
    filmsModel.setRank();
    render(siteHeaderElement, new HeaderProfileComponent(filmsModel.getRank()));
    pageController.render();
    render(siteFooterElement, new FooterStatisticsComponent(filmsModel.getFilmsAll().length));
  })
  .catch(() => {
    noFilmsComponent.hide();
    pageController.render();
  });
