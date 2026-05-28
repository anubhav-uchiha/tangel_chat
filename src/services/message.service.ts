import Message from "../models/message.model";

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
