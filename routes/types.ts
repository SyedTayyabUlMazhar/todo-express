import { Post, User } from "../db/types";
import Schema from "./schema";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { Request, Response as ExpressResponse } from "express";
import { ErrorResponse, SuccessResponse } from "../utils/types";

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

export type Response<D> = ExpressResponse<SuccessResponse<D> | ErrorResponse>;

export type CreatePostResponse = Response<
  Post & {
    author: Omit<User, "password">;
  }
>;

export type UpdatePostBody = schemaOutput<"updatePost">;
export type UpdatePostParams = { id: string };
export type UpdatePostResponse = CreatePostResponse;

export type LikeUnlikeParams = { id: string };
export type LikeUnlikeResponse = CreatePostResponse;
