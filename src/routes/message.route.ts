import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getConversationController,
  getUnreadCountsController,
  uploadChatImageController,
} from "../controllers/message.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router.get(
  "/conversation/:friendId",
  authMiddleware,
  getConversationController,
);

router.get("/unread-counts", authMiddleware, getUnreadCountsController);

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  uploadChatImageController,
);

export default router;
