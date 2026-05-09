import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";

interface JwtPayloads {
  userId: string;
}

export const generateToken = (payload: JwtPayloads): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayloads => {
  return jwt.verify(token, JWT_SECRET) as JwtPayloads;
};
