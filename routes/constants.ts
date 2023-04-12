import Schema from "./schema.js";

export const RouteUrl = {
  Auth: "/auth",
  SignUp: "/signup",
  SignIn: "/signin",

  Post: "/post",
  createPost: "/create",
  updatePost: "/update/:id",
  likeUnlikePost: "/likeUnlike/:id",
  allPosts: "/page=:page",
};

export const RouteSchemaMap = {
  [RouteUrl.Auth + RouteUrl.SignUp]: Schema.signUp,
  [RouteUrl.Auth + RouteUrl.SignIn]: Schema.signIn,
  [RouteUrl.Post + RouteUrl.createPost]: Schema.createPost,
  [RouteUrl.Post + RouteUrl.updatePost]: Schema.updatePost,
};

export const SuccessMessage = {
  signup: "Signup successfull",
  signIn: "SignIn successfull",
  createPost: "Post created sucessfully",
  postUpdated: "Post updated successfully",
};

export const FailureMessage = {
  userExists: "User already exists",
  invalidEmailOrPassword: "Incorrect email or password",
  userDoesntExist: "This user doesn't exist",
  invalidPostId: "The post id is invalid",
};
