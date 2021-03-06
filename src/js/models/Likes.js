
export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {id, title, author, img}
    this.likes.push(like);
    //persist data with on browser localStorage
    this.persistDataLikes();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
    //persist data with on browser localStorage
    this.persistDataLikes();
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistDataLikes() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorageLikes() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if(storage) this.likes = storage;
  }
}

