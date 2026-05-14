import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 4002;
export const MONGO_URI = (process.env.MONGO_URI as string) || "";
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
