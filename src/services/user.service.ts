import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import { createError } from "../utils/createError";
import FriendRequest from "../models/friend-request.model";

export const getCurrentUserService = async (
  userId: string,
): Promise<Partial<IUser>> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("Invalid user", 400);
  }
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw createError("User not found", 404);
  }
  return user;
};

export const getAllUsersService = async (currentUserId?: string) => {
  const users = await User.find({
    is_deleted: false,
    is_active: true,
    is_admin: false,
  }).select("-password");

  if (!currentUserId) {
    return users.map((user: any) => ({
      ...user.toObject(),
      friendshipStatus: "not_logged_in",
    }));
  }

  const requests = await FriendRequest.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  });

  return users
    .map((user: any) => {
      if (user._id.toString() === currentUserId) {
        return null;
      }
      const existingRequest = requests.find((req: any) => {
        return (
          (req.sender.toString() === currentUserId &&
            req.receiver.toString() === user._id.toString()) ||
          (req.receiver.toString() === currentUserId &&
            req.sender.toString() === user._id.toString())
        );
      });

      let friendshipStatus = "not_friend";

      if (existingRequest) {
        if (existingRequest.status === "accepted") {
          friendshipStatus = "friend";
        } else if (existingRequest.status === "pending") {
          friendshipStatus = "pending";
        } else if (existingRequest.status === "unfriended") {
          const unfriendAt = existingRequest.unfriendedAt;

          if (unfriendAt) {
            const now = Date.now();
            const unfriendedTime = new Date(unfriendAt).getTime();

            const oneDay = 24 * 60 * 60 * 1000;

            const diff = now - unfriendedTime;

            if (diff < oneDay) {
              friendshipStatus = "cooldown";
            } else {
              friendshipStatus = "not_friend";
            }
          }
        } else if (existingRequest.status === "rejected") {
          friendshipStatus = "not_friend";
        }
      }
      return {
        ...user.toObject(),
        friendshipStatus,
      };
    })
    .filter(Boolean);
};

export const getFriendsService = async (userId: string) => {
  const requests = await FriendRequest.find({
    status: "accepted",
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "_id first_name last_name username is_online lastSeen")
    .populate(
      "receiver",
      "_id first_name last_name username is_online lastSeen",
    );

  const friends = requests.map((request: any) => {
    if (request.sender._id.toString() === userId) {
      return request.receiver;
    }
    return request.sender;
  });

  return friends;
};
