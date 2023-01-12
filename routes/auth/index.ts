import express, { Request } from "express";
import { SignUpBody } from "../types.js";
import { RouteUrl } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../db/types.js";
import AuthMiddleware from "./middleware.js";
import Collections from "../../db/collections.js";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route(RouteUrl.SignUp)
  .post(
    AuthMiddleware.userExists,
    async function (req: Request<{}, {}, SignUpBody>, res) {
      const body = req.body;

      const user: User = { ...body, userId: uuidv4() };
      await Collections.users.insertOne(user);
      res.send("Signup successs");
    }
  );
