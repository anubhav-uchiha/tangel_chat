import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";
import { initializeSocket } from "./sockets/socket";

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    initializeSocket(server);
    server.listen(PORT as number, "0.0.0.0", () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
