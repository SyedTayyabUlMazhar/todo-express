import { UpdateFilter } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import DateUtil from "../utils/dateUtil.js";
import Collections from "./collections.js";
import { JoinedRoom, Message, Post, Room, RoomType, User } from "./types.js";

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

const addPrivateRoomToUsers = async (
  userId1: string,
  userId2: string,
  roomId: string
) => {
  const addRoomToUser = (userId: string, room: JoinedRoom) => {
    return Collections.users.updateOne({ userId }, { $push: { rooms: room } });
  };

  const roomCommonProps: Omit<JoinedRoom, "otherParticipantId"> = {
    roomId,
    type: RoomType.private,
  };

  await Promise.all([
    addRoomToUser(userId1, { ...roomCommonProps, otherParticipantId: userId2 }),
    addRoomToUser(userId2, { ...roomCommonProps, otherParticipantId: userId1 }),
  ]);

  return;
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

/**
 * Adds the message to the room specified by roomId, and also updates the last message.
 *
 * @param roomId The Id of the room to add message to
 * @param message the message to add
 * @returns true if the room was found and updated
 */
const addMessageToRoom = async (roomId: string, message: Message) => {
  const updateResult = await Collections.rooms.updateOne(
    { id: roomId },
    { $push: { messages: message }, $set: { lastMessage: message } }
  );
  return Boolean(updateResult.matchedCount);
};

const lookForPrivateRoom = async (userId1: string, userId2: string) => {
  const user = await Collections.users.findOne({ userId: userId1 });
  const roomId = user!.rooms.find(
    (room) => room.otherParticipantId === userId2
  )?.roomId;
  return roomId;
};

const createRoom = async (room: Room) => {
  await Collections.rooms.insertOne(room);
  return true;
};

const Query = {
  getUser,
  doesUserExists,
  addPrivateRoomToUsers,
  createPost,
  updatePost,
  likeUnlikePost,
  lookForPrivateRoom,
  createRoom,
  addMessageToRoom,
};

export default Query;
