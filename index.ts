import express from "express";
import dotenv from "dotenv";
import { connectToServer } from "./db/conn.js";
import testRoutes from "./routes/test.js";
import authRoutes from "./routes/auth/index.js";
import { RouteUrl } from "./routes/constants.js";
import Middleware from "./routes/middleware.js";
import postRoutes from "./routes/post/index.js";
import chatSocket from "./chatSocket/index.js";

dotenv.config();

const app = express();

const apiPort = process.env.PORT;
const socketPort = (process.env.SOCKET_PORT as unknown) as number;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use(testRoutes);
app.use(Middleware.bodyValidatorMiddleware);
app.use(RouteUrl.Auth, authRoutes);

app.use(RouteUrl.Post, Middleware.authorized);
app.use(RouteUrl.Post, postRoutes);

const result = await connectToServer();
if (result.success) {
  console.clear();
  app.listen(apiPort, () => {
    console.log(`Server is running on port: ${apiPort}`);
  });

  chatSocket.listen(socketPort);
} else {
  console.error("Error while connecting to db:", result.error);
  process.exit();
}
