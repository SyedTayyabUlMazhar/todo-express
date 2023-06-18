import { Server } from "socket.io";
import DevLog from "../utils/devLog.js";
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
});

export default chatSocket;
