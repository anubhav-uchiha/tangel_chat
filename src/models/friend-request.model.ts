import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFriendRequest extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;

  status: "pending" | "accepted" | "rejected" | "unfriended";
  unfriendedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "unfriended"],
      default: "pending",
    },
    unfriendedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const FriendRequest = mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema,
);

export default FriendRequest;
