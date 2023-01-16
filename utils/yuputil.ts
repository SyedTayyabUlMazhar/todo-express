import { BaseSchema, ValidationError } from "yup";

export const validateSchema = (schema: BaseSchema, value: any) => {
  try {
    schema.validateSync(value);

    return { isValid: true };
  } catch (e) {
    const err = e as ValidationError;

    return { isValid: false, message: err.message };
  }
};