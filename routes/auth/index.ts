import express, { Request } from "express";
import { getDb } from "../../db/conn.js";
import { SignUpBody } from "../types.js";
import { RouteUrl } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../db/types.js";
import { userCollection } from "../../db/collections.js";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route(RouteUrl.SignUp)
  .post(async function (req: Request<{}, {}, SignUpBody>, res) {
    const body = req.body;

    const user: User = { ...body, userId: uuidv4() };
    await userCollection.insertOne(user);
    res.send("Signup successs");
  });
