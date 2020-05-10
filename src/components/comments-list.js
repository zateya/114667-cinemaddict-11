import AbstractComponent from "./abstract-component";

const createCommentsListMarkup = () => {
  return `<ul class="film-details__comments-list"></ul>`;
};

export default class CommentsList extends AbstractComponent {
  getTemplate() {
    return createCommentsListMarkup();
  }
}
