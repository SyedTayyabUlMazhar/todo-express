import { Collection, Db } from "mongodb";

export type JoinedRoom = {
  roomId: string;
  otherParticipantId: string;
  type: RoomType;
};

export type User = {
  userId: string;
  name: string;
  email: string;
  password: string;
  age: number;
  rooms: JoinedRoom[];
};

export type Post = {
  postId: string;
  authorId: string;
  text: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  likedBy: string[];
};

export type Collections = {
  users: Collection<User>;
  posts: Collection<Post>;
  rooms: Collection<Room>;
  init(db: Db): void;
};

export enum MessageType {
  text = "text",
}

export type Message = {
  id: string;
  content: string;
  type: "text";
  timestamp: number;
  receiverId: string;
  senderId: string;
};

export enum RoomType {
  private = "private",
  group = "group",
}

export type Room = {
  id: string;
  type: RoomType;
  participants: string[];
  messages: Message[];
  lastMessage: Message;
};
