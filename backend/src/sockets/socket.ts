import { Server, Socket } from "socket.io";

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", (userId: string) => {
      userSocketMap[userId] = socket.id;
      console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export const getSocketIdByUser = (userId: string) => {
  return userSocketMap[userId];
};
