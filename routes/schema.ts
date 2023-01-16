import * as yup from "yup";

const email = yup.string().email().required().label("Email");
const password = yup.string().required().label("Password");

export const signupSchema = yup.object({
  name: yup.string().required().label("Name"),
  email,
  password,
  age: yup.number().positive().min(18).required().label("Age"),
});

export const signInSchema = yup.object({
  email,
  password,
});
