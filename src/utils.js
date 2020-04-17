export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
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

export const formatIntegerWithSpaces = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ` `);
};
