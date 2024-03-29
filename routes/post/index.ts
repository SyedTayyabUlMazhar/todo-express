import express from "express";
import Query from "../../db/query.js";
import ObjectUtil from "../../utils/objectUtil.js";
import ApiResponse from "../../utils/responseUtil.js";
import { FailureMessage, RouteUrl, SuccessMessage } from "../constants.js";
import {
  AllPostsParams,
  AllPostsResponse,
  AuthorizedRequest,
  CreatePostBody,
  CreatePostResponse,
  LikeUnlikeParams,
  LikeUnlikeResponse,
  UpdatePostBody,
  UpdatePostParams,
  UpdatePostResponse,
} from "../types";
import Collections from "../../db/collections.js";

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

postRoutes
  .route(RouteUrl.likeUnlikePost)
  .patch(
    async (
      req: AuthorizedRequest<LikeUnlikeParams>,
      res: LikeUnlikeResponse
    ) => {
      if (!req.user) return;

      const postId = req.params.id;
      const userId = req.user.userId;

      const updatedPost = await Query.likeUnlikePost(postId, userId);

      if (!updatedPost) {
        res.status(400).json(ApiResponse.failure(FailureMessage.invalidPostId));
        return;
      }

      const postAuthor = await Query.getUser({ userId: updatedPost.authorId });
      const response = {
        ...updatedPost,
        author: ObjectUtil.omitProperties(postAuthor!, "password"),
      };
      res.json(ApiResponse.success(response));
    }
  );

postRoutes
  .route(RouteUrl.allPosts)
  .get(
    async (req: AuthorizedRequest<AllPostsParams>, res: AllPostsResponse) => {
      const page = parseInt(req.params.page);
      const LIMIT = 10;
      const skip = (page - 1) * LIMIT;

      const postsCursor = Collections.posts.find(
        {},
        { limit: LIMIT + 1, skip }
      );
      let posts = await postsCursor.toArray();

      let next = null;
      if (posts.length === LIMIT + 1) {
        next = page + 1;
        posts.pop();
      }

      const postsWithAuthor = await Promise.all(
        posts.map(async (post) => {
          let author = ObjectUtil.omitProperties(
            (await Query.getUser({ userId: post.authorId }))!,
            "password"
          );
          return { ...post, author };
        })
      );

      res.json(
        ApiResponse.success({
          items: postsWithAuthor,
          current: page,
          next,
        })
      );
    }
  );
