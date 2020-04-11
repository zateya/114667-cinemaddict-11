const createFilmsListTemplate = (list) => {
  const {type, title} = list;
  const isAllList = type === `all`;

  const listClass = (isAllList) ? `films-list` : `films-list--${type}`;
  const titleClass = (isAllList) ? `films-list__title visually-hidden` : `films-list__title`;

  return (
    `<section class="${listClass}">
      <h2 class="${titleClass}">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export {createFilmsListTemplate};
