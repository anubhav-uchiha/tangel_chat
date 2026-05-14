import http from "http";
import { Server, Socket } from "socket.io";

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket: Socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
      console.log("Message recived:", data);

      socket.emit("receive_message", {
        text: data.text,
        message: "Message received by backend",
      });
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
  console.log("Socket is initialized");
};
