import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { createError } from "../utils/createError";

export const adminMiddleware = (
  req: AuthRequest,
  _: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next(createError("unauthorized", 401));
    return;
  }
  if (!req.user.is_admin) {
    next(createError("Access denied. Admin only", 403));
    return;
  }
  next();
};
