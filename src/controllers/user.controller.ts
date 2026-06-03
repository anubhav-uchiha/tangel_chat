import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import {
  getAllUsersService,
  getCurrentUserService,
  getFriendsService,
} from "../services/user.service";
import { createError } from "../utils/createError";
import { verifyToken } from "../utils/jwt.util";

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
    res.status(200).json({
      success: true,
      message: "Current user  fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let currentUserId: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        currentUserId = decoded.userId;
      } catch (error) {
        currentUserId = undefined;
      }
    }
    const users = await getAllUsersService(currentUserId);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getFriendsController = async (
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

    const friends = await getFriendsService(userId.toString());

    res
      .status(200)
      .json({ success: true, message: "get friends details", data: friends });
  } catch (error) {
    next(error);
  }
};
