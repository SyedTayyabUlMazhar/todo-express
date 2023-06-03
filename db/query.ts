import Collections from "./collections.js";
import { Post, User } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import DateUtil from "../utils/dateUtil.js";
import { UpdateFilter } from "mongodb";

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
    likedBy: [],
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
      updatedPost = getPost(filter.postId);
    }
  } catch (e) {
    console.error("Query: updatePost: e: ", e);
  } finally {
    return updatedPost;
  }
};

const getPost = async (postId: string) => {
  return Collections.posts.findOne({ postId });
};

/**
 *
 * @param postId The id of the post to like/unlike
 * @param userId The id of user who's liking/unliking the post
 * @returns If postId is valid then the updated post, otherwise null.
 */
const likeUnlikePost = async (postId: string, userId: string) => {
  const post = await getPost(postId);
  if (!post) return null;

  const isLiked = post.likedBy.includes(userId);

  const updates: UpdateFilter<Post> = {
    $set: { updatedAt: DateUtil.nowIso() },
  };

  if (isLiked) {
    updates.$pull = { likedBy: userId };
    updates.$inc = { likes: -1 };
  } else {
    updates.$push = { likedBy: userId };
    updates.$inc = { likes: 1 };
  }

  const updatedPost = (
    await Collections.posts.findOneAndUpdate({ postId }, updates, {
      returnDocument: "after",
    })
  ).value;

  return updatedPost;
};

const Query = {
  getUser,
  doesUserExists,
  createPost,
  updatePost,
  likeUnlikePost,
};

export default Query;
