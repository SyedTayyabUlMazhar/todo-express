import { Collection, Db } from "mongodb";
import { User } from "./types";

export let userCollection: Collection<User>;

export const setUpCollections = (db: Db) => {
  userCollection = db.collection("users");
};
