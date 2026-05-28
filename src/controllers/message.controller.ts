import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { getConversationService } from "./../services/message.service";
import { createError } from "../utils/createError";

export const getConversationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentUserId = req.user?._id;
    if (!currentUserId) {
      next(createError("Unauthorized", 401));
      return;
    }

    const { friendId } = req.params;

    if (!friendId || Array.isArray(friendId)) {
      next(createError("Invalid friend id", 400));
      return;
    }

    const messages = await getConversationService(
      currentUserId.toString(),
      friendId,
    );

    res
      .status(200)
      .json({ success: true, messages: "All conversation", data: messages });
  } catch (error) {
    next(error);
  }
};
