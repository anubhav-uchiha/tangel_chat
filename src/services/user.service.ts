import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import { createError } from "../utils/createError";

export const getCurrentUserService = async (
  userId: string,
): Promise<Partial<IUser>> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("Invalid user", 400);
  }
  const user = await User.findById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  const userObject = user.toObject();

  const { password: _, ...userWithoutPassword } = userObject;

  return userWithoutPassword;
};
