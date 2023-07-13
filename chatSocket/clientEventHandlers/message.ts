import { v4 } from "uuid";
import Query from "../../db/query.js";
import { Message, MessageStatus, Room, RoomType } from "../../db/types.js";
import DevLog from "../../utils/devLog.js";
import { validateSchema } from "../../utils/yuputil.js";
import { EmitEvent, ListenEvent } from "../events.js";
import Schema from "../schema.js";
import { ClientEventHandler } from "../types.js";

const onMessage: ClientEventHandler<ListenEvent.message> =
  (socket) => async (data, callback) => {
    const Log = DevLog.getLabeledLogger(`Socket:${ListenEvent.message}:`);
    {
      if (typeof callback !== "function")
        return Log("Error: Acknowledgement function not received");

      const { isValid, message } = validateSchema(
        Schema.listenMessageSchema,
        data
      );
      if (!isValid) return callback({ ok: false, message: message! });
    }
    let { message: messageFromClient, roomId } = data;
    const message: Message = {
      ...messageFromClient,
      id: messageFromClient.id ?? v4(),
      status: MessageStatus.sent,
      sentAt: Date.now(),
    };

    const { senderId, receiverId } = message;

    Log("recieved:", { roomId, sentMessage: messageFromClient });
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
