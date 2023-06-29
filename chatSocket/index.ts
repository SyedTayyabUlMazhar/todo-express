import { Server } from "socket.io";
import DevLog from "../utils/devLog.js";
import clientEventHandlers from "./clientEventHandlers/index.js";
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

  socket.on(ListenEvent.message, clientEventHandlers.message(socket));
});

export default chatSocket;
