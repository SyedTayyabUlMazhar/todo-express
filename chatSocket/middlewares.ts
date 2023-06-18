import { Server } from "socket.io";
import DevLog from "../utils/devLog.js";
import Jwt from "../utils/jwtUtil.js";
import Query from "../db/query.js";

const isAuthorized: Parameters<Server["use"]>[0] = async (socket, next) => {
  const Log = DevLog.getLabeledLogger("Socket:Middleware:");

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
};

const middleware = { isAuthorized };

export default middleware;
