import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../db/types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME!;

function generateAccessToken(user: Partial<User>) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME });
}

type VerifyToken =
  | { error: jwt.VerifyErrors }
  | { error: null; user: Pick<User, "userId"> };

function verifyToken(token: string) {
  return new Promise<VerifyToken>((resolve) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        resolve({ error: err });
      } else {
        const { iss, sub, aud, exp, nbf, iat, jti, ..._user } =
          user as jwt.JwtPayload;
        resolve({ error: null, user: _user as Pick<User, "userId"> });
      }
    });
  });
}

const Jwt = {
  generate: generateAccessToken,
  verify: verifyToken,
};

export default Jwt;
