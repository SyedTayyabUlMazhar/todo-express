import { RequestHandler } from "express";
import { BaseSchema } from "yup";
import { validateSchema } from "../utils/yuputil.js";

/**
 * Validates the data sent to the api using schema.
 * If invalid a 400 error is returned with validation message.
 */
export const bodyValidatorMiddleware =
  (schema: BaseSchema): RequestHandler =>
  (req, res, next) => {
    const validationResult = validateSchema(schema, req.body);
    if (validationResult.isValid) next();
    else res.status(400).json({ error: { message: validationResult.message } });
  };
