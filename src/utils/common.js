import moment from 'moment';
import {KeyCode} from '../constant.js';

export const getShortText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength).trim() + `…`;
  }

  return text;
};

export const formatDuration = (minutes) => {
  return moment.utc(moment.duration(minutes, `minutes`).as(`milliseconds`)).format(`H[h] mm[m]`);
};

export const formatCommentDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

export const formateDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getFullYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatIntegerWithSpaces = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};

export const setActiveElement = (container, element, activeClass) => {
  const activeElement = container.querySelector(`.${activeClass}`);

  if (!element.classList.contains(`${activeClass}`)) {
    activeElement.classList.remove(activeClass);
    element.classList.add(activeClass);
  }
};

export const isEscEvent = (evt) => evt.keyCode === KeyCode.ESCAPE;

export const isCtrlEnterEvent = (evt) => evt.ctrlKey && evt.keyCode === KeyCode.ENTER;

