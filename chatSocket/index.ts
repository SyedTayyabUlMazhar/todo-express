import { Server } from "socket.io";
import Query from "../db/query.js";
import Jwt from "../utils/jwtUtil.js";
import DevLog from "../utils/devLog.js";
import SocketEvent from "./events.js";
const chatSocket = new Server();

const Log = DevLog.getLabeledLogger("Socket:");

chatSocket.on(SocketEvent.CONNECTION, async (socket) => {
  // Only allow connection for authenticated users.

  Log("Connection Attempt by:", socket.handshake.headers.authorization);

  const authHeader = socket.handshake.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader?.split(" ")[1]
    : null;

  if (!token) {
    socket.disconnect();
    return;
  }

  const tokenVerification = await Jwt.verify(token);

  if (tokenVerification.error) {
    socket.disconnect();
    return;
  }

  const user = await Query.getUser(tokenVerification.user);

  Log("Connection accepted from user: ", user);

  socket.conn.on(SocketEvent.PACKET_RECEIVED, (packet) => {
    Log("RECEIVED:", packet);
  });

  socket.conn.on(SocketEvent.PACEKET_SENT, (packet) => Log("SENT:", packet));
});

export default chatSocket;
