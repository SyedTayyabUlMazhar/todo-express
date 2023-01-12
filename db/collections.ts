import { Collections } from "./types";

const Collections: Collections = {
  users: null!,
  init(db) {
    this.users = db.collection("users");
  },
};

export default Collections;
