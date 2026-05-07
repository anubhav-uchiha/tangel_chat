import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    server.listen(PORT as number, "0.0.0.0", () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
