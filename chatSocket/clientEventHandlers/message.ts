import { v4 } from "uuid";
import Query from "../../db/query.js";
import { Room, RoomType } from "../../db/types.js";
import DevLog from "../../utils/devLog.js";
import { EmitEvent, ListenEvent } from "../events.js";
import { ClientEventHandler } from "../types.js";

const onMessage: ClientEventHandler<ListenEvent.message> =
  (socket) => async (message, roomId, callback) => {
    const Log = DevLog.getLabeledLogger(`Socket:${ListenEvent.message}:`);
    const { senderId, receiverId } = message;

    Log("recieved:", { roomId, message });
    roomId = roomId
      ? roomId
      : await Query.lookForPrivateRoom(senderId, receiverId);

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
      await Query.addPrivateRoomToUsers(senderId, receiverId, roomId);
      Log("new room created");
    }
    // // send the message to reciever
    socket.to(message.receiverId).emit(EmitEvent.message, message, roomId!);
    callback?.({ ok: true, data: { roomId: roomId! } });
  };

export default onMessage;
