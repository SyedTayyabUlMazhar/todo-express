import { Server } from "socket.io";
import Query from "../db/query.js";
import DevLog from "../utils/devLog.js";
import Jwt from "../utils/jwtUtil.js";
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

chatSocket.use(async (socket, next) => {
  const Log = DevLog.getLabeledLogger("Socket:Middleware:");
  // Only allow connection for authenticated users.
  const authHeader = socket.handshake.headers.authorization;
  Log("Authorization Header:", authHeader);

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader?.split(" ")[1]
    : null;

  if (!token) return next(new Error("Unauthorized"));

  const tokenVerification = await Jwt.verify(token);

  if (tokenVerification.error) return next(new Error("Unauthorized"));

  const user = await Query.getUser(tokenVerification.user);
  if (!user) return next(new Error("Invalid user"));

  socket.data = user;
  socket.conn.on("packet", (packet) => {
    Log("RECEIVED:", packet);
  });

  socket.conn.on("packetCreate", (packet) => Log("SENT:", packet));

  next();
});

chatSocket.on("connection", async (socket) => {
  const Log = DevLog.getLabeledLogger("Socket:Connection:");
  Log("User connected: ", socket.id, socket.data);
});

export default chatSocket;
