import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { getCurrentUserService } from "../services/user.service";
import { createError } from "../utils/createError";

export const getCurrentUserController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      next(createError("Unauthorized", 401));
      return;
    }
    const user = await getCurrentUserService(userId?.toString());

    res
      .status(200)
      .json({ sucess: true, message: "User drtail fetched", data: user });
  } catch (error) {
    next(error);
  }
};
