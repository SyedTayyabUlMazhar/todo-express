import { Server } from "socket.io";
import { v4 } from "uuid";
import Query from "../db/query.js";
import { Room, RoomType } from "../db/types.js";
import DevLog from "../utils/devLog.js";
import { ListenEvent } from "./events.js";
import middleware from "./middlewares.js";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types.js";

const chatSocket = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

chatSocket.use(middleware.isAuthorized);

chatSocket.on("connection", async (socket) => {
  const Log = DevLog.getLabeledLogger("Socket:Connection:");
  Log("User connected: ", socket.id, socket.data);
  /**
   * Have the user join a room of their own id.
   * If a user is connected, we'll be able to send them
   * events form another user's socket connection.
   */
  socket.join(socket.data.userId);

  socket.on(ListenEvent.message, async (message, roomId, callback) => {
    const Log = DevLog.getLabeledLogger(`Socket:${ListenEvent.message}:`);
    const { senderId, receiverId } = message;

    Log("recieved:", { roomId, message });
    roomId = roomId
      ? roomId
      : (await Query.lookForPrivateRoom(senderId, receiverId))?.id;

    Log("roomId after conditional lookup:", roomId);

    let isRoomIdValid = Boolean(roomId); // assume it's valid if passed
    if (roomId) {
      isRoomIdValid = await Query.addMessageToRoom(roomId, message);
      Log("provided room id was valid and room was updated: ", isRoomIdValid);
    }

    if (!isRoomIdValid) {
      const room: Room = {
        id: v4(),
        type: RoomType.private,
        participants: [senderId, receiverId],
        messages: [message],
        lastMessage: message,
      };
      roomId = room.id;
      Log("creating new room:", room);
      await Query.createRoom(room);
      Log("new room created");
    }
    // // send the message to reciever
    socket.to(message.receiverId).emit("message", message, roomId!);
    callback?.({ ok: true, data: { roomId: roomId! } });
  });
});

export default chatSocket;
