import express, { Request } from "express";
import { SignUpBody } from "../types.js";
import { RouteUrl, SuccessMessage } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../db/types.js";
import AuthMiddleware from "./middleware.js";
import Collections from "../../db/collections.js";
import Jwt from "../../utils/jwtUtil.js";
import ApiResponse from "../../utils/responseUtil.js";
import Password from "../../utils/passwordUtil.js";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route(RouteUrl.SignUp)
  .post(
    AuthMiddleware.userExists,
    async function (req: Request<{}, {}, SignUpBody>, res) {
      const body = req.body;
      body.password = Password.encrypt(body.password);

      const user: User = { ...body, userId: uuidv4() };
      await Collections.users.insertOne(user);
      const token = Jwt.generate(user);

      res.json(ApiResponse.success({ token }, SuccessMessage.signup));
    }
  );

authRoutes.route(RouteUrl.SignIn).post(async function (req, res) {
  res.send("Sign In");
});
