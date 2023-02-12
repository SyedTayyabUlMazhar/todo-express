import express from "express";
import Query from "../../db/query.js";
import ObjectUtil from "../../utils/objectUtil.js";
import ApiResponse from "../../utils/responseUtil.js";
import { RouteUrl, SuccessMessage } from "../constants.js";
import {
  AuthorizedRequest,
  CreatePostBody,
  CreatePostResponse,
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
