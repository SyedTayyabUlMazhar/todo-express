import { BaseSchema, ObjectSchema, ValidationError } from "yup";
import { TypeOfShape } from "yup/lib/object";

export const validateSchema = (schema: BaseSchema, value: any) => {
  try {
    schema.validateSync(value);

    return { isValid: true };
  } catch (e) {
    const err = e as ValidationError;

    return { isValid: false, message: err.message };
  }
};

/**
 * Attaches a custom validation test to the passed schema.
 * The test fails with an error message if the object or 
 * any of it's nested objects contain any field(s) not
 * specified by the schema.
 * @param schema An Object schema
 * @returns schema
 */
export const addNoUknownTest = <Schema extends ObjectSchema<any>>(
  schema: Schema
) => {
  return schema.test("no-unknown-fields", function (values) {
    const ABORT_EARLY = true;

    function joinByDot(str1: string, str2: string) {
      return str1 ? `${str1}.${str2}` : str2;
    }

    function findUknownFields(
      fields: Schema["fields"],
      values: TypeOfShape<any>,
      parentFieldName: string = ""
    ) {
      const allowedFields = Object.keys(fields);
      const receivedFields = Object.keys(values);
      const knownFields: string[] = [];
      const unknownFields: string[] = [];

      receivedFields.forEach((field) => {
        allowedFields.includes(field)
          ? knownFields.push(field)
          : unknownFields.push(joinByDot(parentFieldName, field));
      });

      if (unknownFields.length && ABORT_EARLY) return unknownFields;

      knownFields.forEach((knownField) => {
        if (
          fields[knownField].type === "object" &&
          typeof values[knownField] === "object"
        ) {
          unknownFields.push(
            ...findUknownFields(
              fields[knownField].fields,
              values[knownField],
              joinByDot(parentFieldName, knownField)
            )
          );
        }
      });
      return unknownFields;
    }

    const unknownFields = findUknownFields(schema.fields, values);
    if (unknownFields.length === 0) return true;

    const helpingVerb = unknownFields.length === 1 ? "is" : "are";
    const message = `${unknownFields.join(", ")} ${helpingVerb} not allowed`;
    return this.createError({
      message,
    });
  });
};
