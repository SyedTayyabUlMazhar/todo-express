import { User } from "../db/types";
import Schema from "./schema";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { Request } from "express";

export type SignUpBody = typeof Schema.signUp["__outputType"];
export type SignInBody = typeof Schema.signIn["__outputType"];

export type AuthorizedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & { user?: User };
