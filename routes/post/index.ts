import express from "express";
import ApiResponse from "../../utils/responseUtil.js";
import { RouteUrl } from "../constants.js";
import { AuthorizedRequest } from "../types";

const postRoutes = express.Router();
export default postRoutes;

postRoutes.route(RouteUrl.createPost).post((req: AuthorizedRequest, res) => {
  if (!req.user) return;
  
  res.json(ApiResponse.success(req.user));
});
