import { Request, RequestHandler } from "express";
import Query from "../../db/query.js";
import ApiResponse from "../../utils/responseUtil.js";
import { FailureMessage } from "../constants.js";
import { SignUpBody } from "../types";

const userExists: RequestHandler = async function (
  req: Request<{}, {}, SignUpBody>,
  res,
  next
) {
  const userExists = await Query.doesUserExists({ email: req.body.email });
  if (userExists) {
    res.status(400).send(ApiResponse.failure(FailureMessage.userExists));
  } else {
    next();
  }
};

const AuthMiddleware = {
  userExists,
};

export default AuthMiddleware;
