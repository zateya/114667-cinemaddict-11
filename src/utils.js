export const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

export const createTemplateNode = (template) => {
  const element = document.createElement(`div`);
  render(element, template);

  return element.firstChild;
};

export const getShortText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength).trim() + `…`;
  }

  return text;
};

export const formatDuration = (hours, minutes) => {
  const formatedHours = hours > 0 ? `${hours}h ` : ``;
  const formatedMinutes = minutes < 10 ? `0${minutes}m` : `${minutes}m`;

  return `${formatedHours}${formatedMinutes}`;
};

const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (date) => {
  const day = castDateTimeFormat(date.getDate());
  const month = castDateTimeFormat(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = castDateTimeFormat(date.getHours());
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};
