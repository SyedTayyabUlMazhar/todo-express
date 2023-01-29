import { RequestHandler } from "express";
import Query from "../db/query.js";
import Jwt from "../utils/jwtUtil.js";
import ApiResponse from "../utils/responseUtil.js";
import { validateSchema } from "../utils/yuputil.js";
import { FailureMessage, RouteSchemaMap } from "./constants.js";
import { AuthorizedRequest } from "./types.js";

/**
 * A middleware to validate the data recieved by the api.
 * If invalid a 400 error is returned with validation message.
 */
const bodyValidatorMiddleware: RequestHandler = (req, res, next) => {
  const schema = RouteSchemaMap[req.url];

  if (!schema) next();
  else {
    const { isValid, message } = validateSchema(schema, req.body);
    if (isValid) {
      req.body = schema.cast(req.body);
      next();
    } else res.status(400).json(ApiResponse.failure(message!));
  }
};

/**
 * Verifies the token passed in header.
 * 401(unauthroized) error is sent to the client if:
 *  - No token is passed, or passed in a wrong format
 *  - The token is invalid
 *  - Token has expired
 *
 * 400(Bad request) error is sent to the client if:
 *  - The token is valid, but the user for which the token was created doesn't exist anymore
 *
 * If none of the above errors occur then, the next request is called
 * and user object is assigned to the req object.
 */
const authorized: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader?.split(" ")[1]
    : null;

  if (!token) return res.sendStatus(401);

  const tokenVerification = await Jwt.verify(token);

  if (tokenVerification.error) return res.sendStatus(401);

  const user = await Query.getUser(tokenVerification.user);

  if (!user)
    return res
      .status(400)
      .json(ApiResponse.failure(FailureMessage.userDoesntExist));

  (req as unknown as AuthorizedRequest).user = user!;

  next();
};

const Middleware = {
  bodyValidatorMiddleware,
  authorized,
};

export default Middleware;
