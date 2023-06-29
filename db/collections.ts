import { Collections } from "./types";

const Collections: Collections = {
  users: null!,
  posts: null!,
  rooms: null!,
  init(db) {
    this.users = db.collection("users");
    this.posts = db.collection("posts");
    this.rooms = db.collection("rooms");
  },
};

export default Collections;
