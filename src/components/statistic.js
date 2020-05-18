import moment from 'moment';
import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StatisticPeriod, statisticFilters, STATISTIC_BAR_HEIGHT} from '../constant.js';

const createStatisticFilterMarkup = (name, value, isChecked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${value}" value="${value}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${value}" class="statistic__filters-label">${name}</label>`
  );
};

const getRankMarkup = (rank) => {
  return (
    `${
      rank !== `` ?
        `<p class="statistic__rank">
          Your ranks
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          ${rank}
        </p>` : ``}`
  );
};

const createStatisticMarkup = (films, rank, genreSatistics) => {
  const rankMarkup = getRankMarkup(rank);

  const statisticFiltersMarkup = statisticFilters.map(({name, value}, i) => createStatisticFilterMarkup(name, value, i === 0)).join(`\n`);

  const filmsCount = films.length;
  const totalDuration = films.reduce((acc, film) => acc + film.duration, 0);
  const hoursMakup = `<span class="statistic__item-description">h</span>`;
  const minutesMarkup = `<span class="statistic__item-description">m</span>`;
  const formatedDuration = moment.utc(moment.duration(totalDuration, `minutes`).as(`milliseconds`)).format(`H [${hoursMakup}] mm [${minutesMarkup}]`);
  const topGenre = genreSatistics.length > 0 ? genreSatistics[0][0] : ``;

  return (
    `<section class="statistic">
      ${rankMarkup}

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticFiltersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">${filmsCount === 1 ? `movie` : `movies`}</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${formatedDuration}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre ? topGenre : ``}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

  </section>`
  );
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcUniqGenresCount = (films, genre) => {
  return films.filter((it) => it.genres.includes(genre)).length;
};

const getDateFrom = (period) => {
  const date = moment();

  switch (period) {
    case StatisticPeriod.TODAY:
      return date.subtract(1, `day`);
    case StatisticPeriod.WEEK:
      return date.subtract(1, `week`);
    case StatisticPeriod.MONTH:
      return date.subtract(1, `month`);
    case StatisticPeriod.YEAR:
      return date.subtract(1, `year`);
  }

  return false;
};

const getWatchedFilmsInPeriod = (films, period) => {
  if (period === StatisticPeriod.ALL_TIME) {
    return films;
  }

  const now = moment();
  const dateFrom = getDateFrom(period);

  return films.filter((film) => moment(film.watchingDate).isBetween(dateFrom, now, null, `[)`));
};

const getGenreSatistics = (films) => {
  const genres = films.reduce((acc, film) => acc.concat(film.genres), []).filter(getUniqItems);

  const counts = genres.map((genre) => calcUniqGenresCount(films, genre));

  return genres.map((genre, i) => [genre, counts[i]]).sort((a, b) => b[1] - a[1]);
};

const renderStatisticsChart = (statisticCtx, genresStatistics) => {
  const genres = genresStatistics.map((genre) => genre[0]);
  const counts = genresStatistics.map((genre) => genre[1]);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
    this._rank = this._filmsModel.getRank();
    this._films = this._filmsModel.getWatchedFilms();
    this._period = StatisticPeriod.ALL_TIME;
    this._genreSatistics = getGenreSatistics(this._films, this._period);
    this._statisticsChart = null;

    this._renderChart();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatisticMarkup(this._films, this._rank, this._genreSatistics);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  reset() {
    const allTimePeriod = StatisticPeriod.ALL_TIME;
    this.rerender(this._filmsModel.getWatchedFilms(), allTimePeriod);
    this.setActiveItem(allTimePeriod);
  }

  rerender(films, period) {
    this._films = films;
    this._period = period;
    this._genreSatistics = getGenreSatistics(this._films, this._period);

    super.rerender();

    this._renderChart();
  }

  setActiveItem(filterItem) {
    const filterElement = this.getElement().querySelector(`#statistic-${filterItem}`);

    if (filterElement) {
      filterElement.checked = true;
    }
  }

  _renderChart() {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._resetChart();

    statisticCtx.height = STATISTIC_BAR_HEIGHT * this._genreSatistics.length;

    this._statisticsChart = renderStatisticsChart(statisticCtx, this._genreSatistics);
  }

  _resetChart() {
    if (this._statisticsChart) {
      this._statisticsChart.destroy();
      this._statisticsChart = null;
    }
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const period = evt.target.value;

      const films = getWatchedFilmsInPeriod(this._filmsModel.getWatchedFilms(), period);

      this.rerender(films, period);

      this.setActiveItem(period);
    });
  }
}
