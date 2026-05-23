import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllUsersController,
  getCurrentUserController,
  getFriendsController,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/me", authMiddleware, getCurrentUserController);
router.get("/all-users", getAllUsersController);
router.get("/friends", authMiddleware, getFriendsController);

export default router;
