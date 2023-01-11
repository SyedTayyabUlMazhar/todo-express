import { RequestHandler } from "express";
import { validateSchema } from "../utils/yuputil.js";
import { RouteSchemaMap } from "./constants.js";

/**
 * A middleware to validate the data recieved by the api.
 * If invalid a 400 error is returned with validation message.
 */
export const bodyValidatorMiddleware: RequestHandler = (req, res, next) => {
  const schema = RouteSchemaMap[req.url];

  if (!schema) next();
  else {
    const { isValid, message } = validateSchema(schema, req.body);
    if (isValid) next();
    else res.status(400).json({ error: { message } });
  }
};
