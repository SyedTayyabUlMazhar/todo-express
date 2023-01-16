import Schema from "./schema";

export type SignUpBody = typeof Schema.signUp["__outputType"];
export type SignInBody = typeof Schema.signIn["__outputType"];
