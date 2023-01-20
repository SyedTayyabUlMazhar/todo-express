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

const Schema = {
  signUp: signupSchema,
  signIn: signInSchema,
};

export default Schema;
