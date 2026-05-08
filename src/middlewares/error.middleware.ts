import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.types";

export const errorMiddleware = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("ERROR:", error);

  if (error.code === 11000) {
    res.status(409).json({ success: false, message: "Email Already exits" });
    return;
  }
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
