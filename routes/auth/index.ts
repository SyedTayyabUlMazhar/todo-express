import express, { Request, RequestHandler } from "express";
import { getDb } from "../../db/conn.js";
import { signupSchema } from "../schema.js";
import { bodyValidatorMiddleware } from "../middleware.js";
import { SignUpBody } from "../types.js";

const authRoutes = express.Router();
export default authRoutes;

authRoutes
  .route("/signup")
  .post(
    bodyValidatorMiddleware(signupSchema),
    async function (req: Request<{}, {}, SignUpBody>, res) {
      const db = getDb();

      res.send("Signup successs");
    }
  );
