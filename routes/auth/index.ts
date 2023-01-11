import express, { Request } from "express";
import { getDb } from "../../db/conn.js";
import { SignUpBody } from "../types.js";
import { RouteUrl } from "../constants.js";
import { v4 as uuidv4 } from "uuid";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route(RouteUrl.SignUp)
  .post(async function (req: Request<{}, {}, SignUpBody>, res) {
    const db = getDb();
    const body = req.body;

    const user = { ...body, userId: uuidv4() };
    await db.collection("users").insertOne(user);
    res.send("Signup successs");
  });
