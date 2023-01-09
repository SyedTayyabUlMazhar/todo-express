import express from "express";
import dotenv from "dotenv";
import { connectToServer } from "./db/conn.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

const result = await connectToServer();
if (result.success) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} else {
  console.error("Error while connecting to db:", result.error);
  process.exit();
}
