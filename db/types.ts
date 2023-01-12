import { Collection, Db } from "mongodb";

export type User = {
  userId: string;
  name: string;
  email: string;
  password: string;
  age: number;
};

export type Collections = {
  users: Collection<User>;
  init(db: Db): void;
};
