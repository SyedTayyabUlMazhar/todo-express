import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../db/types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

function generateAccessToken(user: Partial<User>) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "18s" });
}

const Jwt = {
  generate: generateAccessToken,
};

export default Jwt;
