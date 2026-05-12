import { NextFunction, Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginUserService(req.body);

    res
      .status(200)
      .json({ success: true, message: "Login successfully", data: result });
  } catch (error) {
    next(error);
  }
};
