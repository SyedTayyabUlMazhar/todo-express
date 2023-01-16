import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().required().label("Name"),
  email: yup.string().email().required().label("Email"),
  password: yup.string().required().label("Password"),
  age: yup.number().positive().min(18).required().label("Age"),
});
