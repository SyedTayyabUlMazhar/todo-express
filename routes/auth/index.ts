import express, { Request } from "express";
import { SignInBody, SignUpBody } from "../types.js";
import { FailureMessage, RouteUrl, SuccessMessage } from "../constants.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../db/types.js";
import AuthMiddleware from "./middleware.js";
import Collections from "../../db/collections.js";
import Jwt from "../../utils/jwtUtil.js";
import ApiResponse from "../../utils/responseUtil.js";
import Password from "../../utils/passwordUtil.js";
import Query from "../../db/query.js";

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

authRoutes
  .route(RouteUrl.SignIn)
  .post(async function (req: Request<{}, {}, SignInBody>, res) {
    req.body.password = Password.encrypt(req.body.password);
    const {
      body: { email, password },
    } = req;

    const user = await Query.getUser({ email });

    const userDoesntExist = !user;
    const invalidPassword = user?.password !== password;
    const invalidEmailOrPassword = userDoesntExist || invalidPassword;

    if (invalidEmailOrPassword) {
      res
        .status(400)
        .json(ApiResponse.failure(FailureMessage.invalidEmailOrPassword));
    } else {
      res.send("Sign In");
    }
  });
