import AbstractComponent from "./abstract-component";

const createCommentsContainerTemplate = () => {
  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
      </section>
    </div>`
  );
};

export default class CommentsContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createCommentsContainerTemplate();
  }

  getCommentsWrapElement() {
    return this.getElement().querySelector(`.film-details__comments-wrap`);
  }
}
