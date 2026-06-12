import mongoose from "mongoose";
import Message from "../models/message.model";
import { createError } from "../utils/createError";
import { s3Client } from "../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME } from "../config/env";
import { AWS_REGION } from "./../config/env";

export const getConversationService = async (
  currentUserId: string,
  friendId: string,
) => {
  const message = await Message.find({
    $or: [
      { sender: currentUserId, receiver: friendId },
      { sender: friendId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });
  return message;
};

export const getUnreadCountsService = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError("User not found", 400);
  }
  const unreadCounts = await Message.aggregate([
    {
      $match: {
        receiver: new mongoose.Types.ObjectId(userId),
        is_seen: false,
      },
    },
    {
      $group: {
        _id: "$sender",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  return unreadCounts;
};

export const uploadChatImageService = async (
  file: Express.Multer.File,
): Promise<string> => {
  const fileName = `chat-images/${Date.now()}-${file.originalname}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
};
