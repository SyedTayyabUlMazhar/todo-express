import { signupSchema } from "./schema";

export type SignUpBody = typeof signupSchema["__outputType"];
