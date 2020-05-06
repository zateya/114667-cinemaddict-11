export const getCommentsByFilm = (film, comments) => {
  return comments.filter((comment) => film.comments.includes(comment.id));
};
