import express, { Application, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import friendRequestRoutes from "./routes/friend-request.route";
import messageRoutes from "./routes/message.route";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res: Response) => {
  res.send("API ias running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/request", friendRequestRoutes);
app.use("/api/message", messageRoutes);

app.use(errorMiddleware);

export default app;
