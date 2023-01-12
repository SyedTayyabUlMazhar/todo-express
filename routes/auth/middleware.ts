import { Request, RequestHandler } from "express";
import Query from "../../db/query.js";
import { SignUpBody } from "../types";

const userExists: RequestHandler = async function (
  req: Request<{}, {}, SignUpBody>,
  res,
  next
) {
  const userExists = await Query.doesUserExists({ email: req.body.email });
  if (userExists) {
    res.status(400).send({ error: { message: "User already exists" } });
  } else {
    next();
  }
};

const AuthMiddleware = {
  userExists,
};

export default AuthMiddleware;
