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

const isSameDay = (date1, date2) => {
  return moment(date1).isSame(date2, `day`);
};

export const formatCommentDate = (date) => {
  const now = moment();

  if (isSameDay(now, date)) {
    const today = now.clone().startOf(`day`);
    const isLessHalfDay = now.diff(today, `hours`) < 12;
    return isLessHalfDay ? moment(date).format(`YYYY/MM/DD HH:mm`) : `Today`;
  }

  const yesterday = now.clone().subtract(1, `days`).startOf(`day`);

  return isSameDay(yesterday, date) ? `Yesterday` : moment(date).fromNow();
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
