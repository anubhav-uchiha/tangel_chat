import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  acceptFriendRequestController,
  getIncomingRequestController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unfriendController,
} from "../controllers/friend-request.controller";

const router = express.Router();
router.post("/send", authMiddleware, sendFriendRequestController);
router.get("/incoming", authMiddleware, getIncomingRequestController);
router.patch(
  "/accept/:requestId",
  authMiddleware,
  acceptFriendRequestController,
);
router.patch(
  "/reject/:requestId",
  authMiddleware,
  rejectFriendRequestController,
);

router.delete("/unfriend/:friendId", authMiddleware, unfriendController);

export default router;
