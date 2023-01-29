import * as yup from "yup";

const email = yup.string().email().required().label("Email");
const password = yup.string().required().label("Password");

const signupSchema = yup.object({
  name: yup.string().required().label("Name"),
  email,
  password,
  age: yup.number().positive().min(18).required().label("Age"),
});

const signInSchema = yup.object({
  email,
  password,
});

const createPostSchema = yup.object({
  text: yup.string().required().min(40).label("Text"),
});

const Schema = {
  signUp: signupSchema,
  signIn: signInSchema,
  createPost: createPostSchema,
};

export default Schema;
