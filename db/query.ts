import Collections from "./collections.js";
import { Post, User } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import DateUtil from "../utils/dateUtil.js";

const getUser = async (userProperties: Partial<User>) => {
  try {
    const user = await Collections.users.findOne(userProperties);
    return user;
  } catch (e) {
    console.error("Error while fetching user: ", e);
    return null;
  }
};

const doesUserExists = async (userProperties: Partial<User>) => {
  return Boolean(await getUser(userProperties));
};

const createPost = async (postText: string, authorId: string): Promise<Post> => {
  const post: Post = {
    postId: uuidv4(),
    authorId,
    text: postText,
    likes: 0,
    createdAt: DateUtil.nowIso(),
    updatedAt: DateUtil.nowIso(),
    deletedAt: null,
  };

  await Collections.posts.insertOne(post);

  return post;
};

const Query = {
  getUser,
  doesUserExists,
  createPost,
};

export default Query;
