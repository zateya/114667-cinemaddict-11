export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
    this.message = data[`comment`];
    this.emoji = data[`emotion`];
  }

  toRAW() {
    return {
      "date": this.date.toISOString(),
      "comment": this.message,
      "emotion": this.emoji,
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
