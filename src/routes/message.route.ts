import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getConversationController } from "../controllers/message.controller";

const router = express.Router();

router.get(
  "/conversation/:friendId",
  authMiddleware,
  getConversationController,
);

export default router;
