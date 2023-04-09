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

const createPost = async (
  postText: string,
  authorId: string
): Promise<Post> => {
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

const updatePost = async (
  filter: Partial<Post> & Pick<Post, "postId">,
  updates: Partial<Post>
): Promise<Post | null> => {
  let updatedPost = null;
  try {
    updates.updatedAt = DateUtil.nowIso();
    const result = await Collections.posts.updateOne(filter, { $set: updates });

    if (result.matchedCount) {
      updatedPost = Collections.posts.findOne({ postId: filter.postId });
    }
  } catch (e) {
    console.error("Query: updatePost: e: ", e);
  } finally {
    return updatedPost;
  }
};

const Query = {
  getUser,
  doesUserExists,
  createPost,
  updatePost,
};

export default Query;
