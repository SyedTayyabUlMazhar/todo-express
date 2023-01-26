import { User } from "../db/types";
import Schema from "./schema";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { Request } from "express";

type schemaOutput<SchemaKey extends keyof typeof Schema> =
  typeof Schema[SchemaKey]["__outputType"];

export type SignUpBody = schemaOutput<"signUp">;
export type SignInBody = schemaOutput<"signIn">;

export type AuthorizedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & { user?: User };

export type CreatePostBody = schemaOutput<"createPost">;
