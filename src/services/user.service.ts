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

export const getAllUsersService = async (): Promise<Partial<IUser>[]> => {
  const users = await User.find({
    is_deleted: false,
    is_active: true,
    is_admin: false,
  }).select("-password");

  return users;
};

export const getFriendsService = async (userId: string) => {
  const requests = await FriendRequest.find({
    status: "accepted",
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "_id first_name last_name username")
    .populate("receiver", "_id first_name last_name username");

  const friends = requests.map((request: any) => {
    if (request.sender._id.toString() === userId) {
      return request.receiver;
    }
    return request.sender;
  });

  return friends;
};
