import express from "express";
import Query from "../../db/query.js";
import ObjectUtil from "../../utils/objectUtil.js";
import ApiResponse from "../../utils/responseUtil.js";
import { FailureMessage, RouteUrl, SuccessMessage } from "../constants.js";
import {
  AuthorizedRequest,
  CreatePostBody,
  CreatePostResponse,
  UpdatePostBody,
  UpdatePostParams,
  UpdatePostResponse,
} from "../types";

const postRoutes = express.Router();
export default postRoutes;

postRoutes
  .route(RouteUrl.createPost)
  .post(
    async (
      req: AuthorizedRequest<{}, {}, CreatePostBody>,
      res: CreatePostResponse
    ) => {
      if (!req.user) return;

      const post = await Query.createPost(req.body.text, req.user.userId);
      const author = ObjectUtil.omitProperties(req.user, "password");
      const response = { ...post, author };

      res.json(ApiResponse.success(response, SuccessMessage.createPost));
    }
  );

postRoutes
  .route(RouteUrl.updatePost)
  .patch(
    async (
      req: AuthorizedRequest<UpdatePostParams, {}, UpdatePostBody>,
      res: UpdatePostResponse
    ) => {
      if (!req.user) return;

      const postId = req.params.id;
      const updatedPost = await Query.updatePost(
        { postId, authorId: req.user.userId },
        req.body
      );
      if (!updatedPost) {
        res.status(400).json(ApiResponse.failure(FailureMessage.invalidPostId));
      } else {
        const author = ObjectUtil.omitProperties(req.user, "password");
        const response = { ...updatedPost, author };
        res.status(200).json(ApiResponse.success(response));
      }
    }
  );
