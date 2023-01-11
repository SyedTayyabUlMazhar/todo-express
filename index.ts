import express from "express";
import dotenv from "dotenv";
import { connectToServer } from "./db/conn.js";
import testRoutes from "./routes/test.js";
import authRoutes from "./routes/auth/index.js";
import { bodyValidatorMiddleware } from "./routes/middleware.js";
import { RouteUrl } from "./routes/constants.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use(testRoutes);
app.use(bodyValidatorMiddleware);
app.use(RouteUrl.Auth, authRoutes);

const result = await connectToServer();
if (result.success) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} else {
  console.error("Error while connecting to db:", result.error);
  process.exit();
}
