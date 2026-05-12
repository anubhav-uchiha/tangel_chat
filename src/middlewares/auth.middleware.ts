import { NextFunction, Response } from "express";
import { createError } from "../utils/createError";
import { verifyToken } from "../utils/jwt.util";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.types";

export const authMiddleware = async (
  req: AuthRequest,
  _: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError("Unauthorized", 401);
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError("User not found", 404);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
