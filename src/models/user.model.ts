import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  userImage_url?: string | null;
  bio?: string | null;
  is_deleted: boolean;
  is_admin: boolean;
  is_active: boolean;
  is_online: boolean;
  deletedAt: Date | null;
  lastSeen: Date | null;
  socketId?: string | null;
  friends: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    userImage_url: {
      type: String,
      default: null,
      trim: true,
    },
    bio: {
      type: String,
      default: null,
      maxlength: 200,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    socketId: {
      type: String,
      default: null,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
