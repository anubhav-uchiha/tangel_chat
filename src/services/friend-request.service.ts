import mongoose from "mongoose";
import { createError } from "../utils/createError";
import User from "../models/user.model";
import FriendRequest from "../models/friend-request.model";

export const sendFreindRequestService = async (
  senderId: string,
  receiverId: string,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    throw createError("Invalid user", 400);
  }

  if (senderId === receiverId) {
    throw createError("You cannot send request to yourself", 400);
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    throw createError("User not found", 404);
  }

  // const alreadyFriends = sender.friends.includes(receiver._id);

  // if (alreadyFriends) {
  //   throw createError("Already friends", 400);
  // }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      {
        sender: senderId,
        receiver: receiverId,
      },
      {
        sender: receiverId,
        receiver: senderId,
      },
    ],
  });

  if (existingRequest) {
    if (existingRequest.status === "pending") {
      throw createError(
        "Friend request already exists between these users",
        400,
      );
    }

    if (existingRequest.status === "accepted") {
      throw createError("You are already friends", 400);
    }

    if (existingRequest.status === "rejected") {
      existingRequest.sender = new mongoose.Types.ObjectId(senderId);
      existingRequest.receiver = new mongoose.Types.ObjectId(receiverId);
      existingRequest.status = "pending";

      await existingRequest.save();
      return existingRequest;
    }

    if (existingRequest.status === "unfriended") {
      const unfriendedAt = existingRequest.unfriendedAt;

      if (unfriendedAt) {
        const now = new Date();

        const diff = now.getTime() - new Date(unfriendedAt).getTime();

        const oneDay = 24 * 60 * 60 * 1000;

        if (diff < oneDay) {
          const remainingHours = Math.ceil((oneDay - diff) / (60 * 60 * 1000));

          throw createError(
            `Wait ${remainingHours} hour(s) before sending request again`,
            400,
          );
        }
      }
      existingRequest.sender = new mongoose.Types.ObjectId(senderId);

      existingRequest.receiver = new mongoose.Types.ObjectId(receiverId);

      existingRequest.status = "pending";
      existingRequest.unfriendedAt = null;
      await existingRequest.save();
      return existingRequest;
    }
  }

  const friendRequest = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });

  return friendRequest;
};

export const getIncomingRequestService = async (userId: string) => {
  const requests = await FriendRequest.find({
    receiver: userId,
    status: "pending",
  })
    .populate("sender", "first_name last_name username email")
    .sort({ createAt: -1 });
  return requests;
};

export const acceptFriendRequestService = async (
  requestId: string,
  currentUserId: string,
) => {
  const request = await FriendRequest.findById(requestId);

  if (!request) {
    throw createError("Request not found", 404);
  }

  if (request.receiver.toString() !== currentUserId) {
    throw createError("Unauthorized", 401);
  }

  if (request.status !== "pending") {
    throw createError("Request already handled", 404);
  }
  request.status = "accepted";
  await request.save();
  await User.findByIdAndUpdate(request.sender, {
    $push: {
      friends: request.receiver,
    },
  });
  await User.findByIdAndUpdate(request.receiver, {
    $push: {
      friends: request.sender,
    },
  });
  return request;
};

export const rejectFriendRequestService = async (
  requestId: string,
  currentUserId: string,
) => {
  const request = await FriendRequest.findById(requestId);

  if (!request) {
    throw createError("Request not found", 404);
  }
  if (request.receiver.toString() !== currentUserId) {
    throw createError("unauthorized", 401);
  }
  request.status = "rejected";
  await request.save();
  return request;
};

export const unfriendService = async (
  currentUserId: string,
  friendId: string,
) => {
  const request = await FriendRequest.findOne({
    status: "accepted",
    $or: [
      { sender: currentUserId, receiver: friendId },
      { sender: friendId, receiver: currentUserId },
    ],
  });

  if (!request) {
    throw createError("Friend not found", 404);
  }

  request.status = "unfriended";
  request.unfriendedAt = new Date();

  await request.save();

  await User.findByIdAndUpdate(currentUserId, {
    $pull: {
      friends: friendId,
    },
  });

  await User.findByIdAndUpdate(friendId, {
    $pull: {
      friends: currentUserId,
    },
  });
  return request;
};
