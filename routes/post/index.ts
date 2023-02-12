import express from "express";
import Query from "../../db/query.js";
import ApiResponse from "../../utils/responseUtil.js";
import { RouteUrl, SuccessMessage } from "../constants.js";
import { AuthorizedRequest, CreatePostBody } from "../types";

const postRoutes = express.Router();
export default postRoutes;

postRoutes
  .route(RouteUrl.createPost)
  .post(async (req: AuthorizedRequest<{}, {}, CreatePostBody>, res) => {
    if (!req.user) return;

      const post = await Query.createPost(req.body.text, req.user.userId);

    res.json(ApiResponse.success(post, SuccessMessage.createPost));
  });
