import { Collections } from "./types";

const Collections: Collections = {
  users: null!,
  posts: null!,
  init(db) {
    this.users = db.collection("users");
    this.posts = db.collection("posts");
  },
};

export default Collections;
