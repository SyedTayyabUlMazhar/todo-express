import { Collection, Db } from "mongodb";

export type User = {
  userId: string;
  name: string;
  email: string;
  password: string;
  age: number;
};

export type Post = {
  postId: string;
  authorId: string;
  text: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  likedBy: string[],
};

export type Collections = {
  users: Collection<User>;
  posts: Collection<Post>;
  init(db: Db): void;
};
