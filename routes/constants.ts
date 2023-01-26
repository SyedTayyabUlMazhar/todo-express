import Schema from "./schema.js";

export const RouteUrl = {
  Auth: "/auth",
  SignUp: "/signup",
  SignIn: "/signin",

  Post: "/post",
  createPost: "/create",
};

export const RouteSchemaMap = {
  [RouteUrl.Auth + RouteUrl.SignUp]: Schema.signUp,
  [RouteUrl.Auth + RouteUrl.SignIn]: Schema.signIn,
  [RouteUrl.Post + RouteUrl.createPost]: Schema.createPost,
};

export const SuccessMessage = {
  signup: "Signup successfull",
  signIn: "SignIn successfull",
};

export const FailureMessage = {
  userExists: "User already exists",
  invalidEmailOrPassword: "Incorrect email or password",
  userDoesntExist: "This user doesn't exist",
};
