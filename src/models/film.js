export default class Film {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.title = data[`film_info`].title;
    this.originalTitle = data[`film_info`].alternative_title;
    this.rating = data[`film_info`].total_rating;
    this.poster = data[`film_info`].poster;
    this.ageRating = data[`film_info`].age_rating;
    this.director = data[`film_info`].director;
    this.writers = data[`film_info`].writers;
    this.actors = data[`film_info`].actors;
    this.release = new Date(data[`film_info`].release.date);
    this.country = data[`film_info`].release.release_country;
    this.duration = data[`film_info`].runtime;
    this.genres = data[`film_info`].genre;
    this.description = data[`film_info`].description;
    this.isWatchList = Boolean(data[`user_details`].watchlist);
    this.isWatched = Boolean(data[`user_details`].already_watched);
    this.isFavorite = Boolean(data[`user_details`].favorite);
    this.watchingDate = data[`user_details`].watching_date ? new Date(data[`user_details`].watching_date) : null;
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.release.toISOString(),
          "release_country": this.country,
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isWatchList,
        "already_watched": this.isWatched,
        "favorite": this.isFavorite,
        "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
      },
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
