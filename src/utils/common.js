import moment from "moment";

export const getShortText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength).trim() + `…`;
  }

  return text;
};

export const formatDuration = (minutes) => {
  return moment.utc(moment.duration(minutes, `minutes`).as(`milliseconds`)).format(`H[h] mm[m]`);
};

export const formatDate = (date) => {
  const now = moment();
  const today = now.startOf(`day`);

  const isSameDay = moment(now).isSame(date, `day`);
  const isMoreHalfDay = now.diff(today, `hours`) > 12;

  if (isSameDay && isMoreHalfDay) {
    return `Today`;
  }

  if (isSameDay) {
    return moment(date).format(`YYYY/MM/DD HH:mm`);
  }

  const yesterday = now.subtract(1, `days`).startOf(`day`);
  const isYesterday = moment(yesterday).isSame(date, `day`);

  if (isYesterday) {
    return `Yesterday`;
  }

  return moment(date).fromNow();
};

export const getFullYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatIntegerWithSpaces = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};
