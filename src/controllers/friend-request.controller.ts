import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { createError } from "../utils/createError";
import {
  getIncomingRequestService,
  sendFreindRequestService,
  acceptFriendRequestService,
  rejectFriendRequestService,
  unfriendService,
} from "../services/firend-request.service";
import { getIO, onlineUsers } from "../sockets/socket";

export const sendFriendRequestController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const senderId = req.user?._id;

    if (!senderId) {
      next(createError("Unauthorized", 401));
      return;
    }
    const { receiverId } = req.body;
    const request = await sendFreindRequestService(
      senderId.toString(),
      receiverId,
    );

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("friend_request_sent");
    }

    res
      .status(201)
      .json({ success: true, message: "Friend request sent", data: request });
  } catch (error) {
    next(error);
  }
};

export const getIncomingRequestController = async (
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
    const requests = await getIncomingRequestService(userId.toString());

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequestController = async (
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
    const { requestId } = req.params;

    if (!requestId || Array.isArray(requestId)) {
      next(createError("Invalid request id", 400));
      return;
    }

    const request = await acceptFriendRequestService(
      requestId,
      currentUserId.toString(),
    );

    const senderSocketId = onlineUsers.get(request.sender.toString());

    if (senderSocketId) {
      getIO().to(senderSocketId).emit("friend_request_accepted");
    }

    res.status(200).json({
      success: true,
      message: "Friend request accepted",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectFriendRequestController = async (
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
    const { requestId } = req.params;

    if (!requestId || Array.isArray(requestId)) {
      next(createError("Invalid request id", 400));
      return;
    }
    const request = await rejectFriendRequestService(
      requestId,
      currentUserId.toString(),
    );

    const senderId = request.sender.toString();

    const senderSocketId = onlineUsers.get(senderId);

    if (senderSocketId) {
      getIO().to(senderSocketId).emit("friend_request_rejected", {
        userId: currentUserId.toString(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Friend request rejected",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const unfriendController = async (
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
      next(createError("Invalid request id", 400));
      return;
    }
    await unfriendService(currentUserId.toString(), friendId);

    const friendSocketId = onlineUsers.get(friendId);
    const currentUserSocketId = onlineUsers.get(currentUserId.toString());

    if (friendSocketId) {
      getIO().to(friendSocketId).emit("unfriend_success");
    }

    if (currentUserSocketId) {
      getIO().to(currentUserSocketId).emit("unfriend_success");
    }

    res.status(200).json({ success: true, message: "Unfriend successfully" });
  } catch (error) {
    next(error);
  }
};
