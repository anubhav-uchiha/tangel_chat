import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 4002;
export const MONGO_URI = (process.env.MONGO_URI as string) || "";
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const AWS_REGION = process.env.AWS_REGION as string;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
export const AWS_SECRET_ACCESS_KEY = process.env
  .AWS_SECRET_ACCESS_KEY as string;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;
