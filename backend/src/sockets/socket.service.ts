import { Server } from "socket.io";
import { getSocketIdByUser } from "./socket";

let ioInstance: Server;

export const initSocketService = (io: Server) => {
  ioInstance = io;
};

export const emitTaskUpdated = (task: any) => {
  ioInstance.emit("taskUpdated", task);
};

export const emitTaskAssigned = (userId: string, payload: any) => {
  const socketId = getSocketIdByUser(userId);
  if (socketId) {
    ioInstance.to(socketId).emit("taskAssigned", payload);
  }
};
