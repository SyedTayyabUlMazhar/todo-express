import express, { Request } from "express";
import { getDb } from "../../db/conn.js";
import { SignUpBody } from "../types.js";
import { RouteUrl } from "../constants.js";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route(RouteUrl.SignUp)
  .post(async function (req: Request<{}, {}, SignUpBody>, res) {
    const db = getDb();

    res.send("Signup successs");
  });
