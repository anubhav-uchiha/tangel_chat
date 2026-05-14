import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getCurrentUserController } from "../controllers/user.controller";
const router = express.Router();

router.get("/me", authMiddleware, getCurrentUserController);

export default router;
