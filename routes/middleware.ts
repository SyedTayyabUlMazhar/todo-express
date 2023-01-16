import { RequestHandler } from "express";
import ApiResponse from "../utils/responseUtil.js";
import { validateSchema } from "../utils/yuputil.js";
import { RouteSchemaMap } from "./constants.js";
import { signupSchema } from "./schema.js";

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
      req.body = signupSchema.cast(req.body);
      next();
    } else res.status(400).json(ApiResponse.failure(message!));
  }
};

const Middleware = {
  bodyValidatorMiddleware,
};

export default Middleware;
