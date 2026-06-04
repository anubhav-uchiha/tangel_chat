import http from "http";
import { Server, Socket } from "socket.io";
import { createError } from "../utils/createError";
import { verifyToken } from "../utils/jwt.util";
import User from "../models/user.model";
import Message from "../models/message.model";

// === online users map ===
export const onlineUsers = new Map<string, string>();

let io: Server;

export const getIO = () => io;

// === socket initialization ===
export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // === socket authentication ===
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(createError("Unauthorized", 401));
      }

      const decoded = verifyToken(token);

      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(createError("User not found", 404));
      }

      socket.data.user = user;

      next();
    } catch (error) {
      next(createError("Authentication failed", 401));
    }
  });

  // === connection event ===
  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.user._id.toString();

    // === user online logic ===
    onlineUsers.set(userId, socket.id);

    await User.findByIdAndUpdate(userId, {
      is_online: true,
      socketId: socket.id,
    });

    io.emit("user_status_changed", {
      userId,
      is_online: true,
    });

    console.log("Online Users: ", onlineUsers);
    console.log(`User Connected: ${socket.id}`);
    console.log("Authenticated User: ", socket.data.user.username);

    // === send message ===
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, text } = data;
        const senderId = socket.data.user._id;

        const senderUser = await User.findById(senderId);

        if (!senderUser) {
          socket.emit("error_message", {
            message: "Sender not found",
          });
          return;
        }

        const isFriend = senderUser.friends.some(
          (id) => id.toString() === receiverId,
        );

        if (!isFriend) {
          socket.emit("error_message", {
            message: "You are no longer friends",
          });
          return;
        }

        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text,
        });

        const receiverSocketId = onlineUsers.get(receiverId);

        const messageData = {
          _id: newMessage._id,
          text: newMessage.text,
          senderId,
          receiverId,
        };

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", messageData);
        }
        socket.emit("receive_message", messageData);
      } catch (error) {
        console.log(error);
      }
    });

    // === typing indicator ===
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", {
          userId: userId,
        });
      }
    });

    socket.on("stop_typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", {
          userId: userId,
        });
      }
    });

    // === disconnect event ===
    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        is_online: false,
        socketId: null,
        lastSeen: new Date(),
      });

      io.emit("user_status_changed", {
        userId,
        is_online: false,
        lastSeen: new Date(),
      });
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
  console.log("Socket is initialized");
};
