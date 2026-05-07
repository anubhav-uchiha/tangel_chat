import mongoose from "mongoose";
import { MONGO_URI } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error);
    process.exit(1);
  }
};
