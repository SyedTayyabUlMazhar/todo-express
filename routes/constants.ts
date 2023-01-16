import { signInSchema, signupSchema } from "./schema.js";

export const RouteUrl = {
  Auth: "/auth",
  SignUp: "/signup",
  SignIn: "/signin",
};

export const RouteSchemaMap = {
  [RouteUrl.Auth + RouteUrl.SignUp]: signupSchema,
  [RouteUrl.Auth + RouteUrl.SignIn]: signInSchema,
};

export const SuccessMessage = {
  signup: "Signup successfull",
};

export const FailureMessage = {
  userExists: "User already exists",
};
