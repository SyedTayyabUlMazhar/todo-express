import { signupSchema } from "./schema.js";

export const RouteUrl = {
  Auth: "/auth",
  SignUp: "/signup",
};

export const RouteSchemaMap = {
  [RouteUrl.Auth + RouteUrl.SignUp]: signupSchema,
};

export const SuccessMessage = {
  signup: "Signup successfull",
};

export const FailureMessage = {
  userExists: "User already exists",
};
