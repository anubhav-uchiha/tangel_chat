import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import {
  getAllUsersService,
  getCurrentUserService,
  getFriendsService,
} from "../services/user.service";
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
  _: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await getAllUsersService();
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
