import FilterComponent from '../components/filter.js';
import {FilterType, filterNames} from "../constant.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;

    const allFilms = this._filmsModel.getFilmsAll();

    const filters = Object.values(FilterType).map((filterType, i) => {
      return {
        name: filterNames[i],
        type: filterType,
        count: filterType !== FilterType.ALL ? getFilmsByFilter(allFilms, filterType).length : null,
        isActive: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterClickHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  setActiveItem(filterType) {
    this._filterComponent.setActiveItem(filterType);
  }

  _onDataChange() {
    this.render();
  }
}
