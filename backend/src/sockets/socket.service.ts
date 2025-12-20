import { Server } from "socket.io";
import { getSocketIdByUser } from "./socket";

let ioInstance: Server;

export const initSocketService = (io: Server) => {
  ioInstance = io;
};

export const emitTaskCreated = (task: any) => {
  if (ioInstance) {
    ioInstance.emit("taskCreated", task);
  }
};

export const emitTaskUpdated = (task: any) => {
  if (ioInstance) {
    ioInstance.emit("taskUpdated", task);
  }
};

export const emitTaskDeleted = (taskId: string) => {
  if (ioInstance) {
    ioInstance.emit("taskDeleted", { taskId });
  }
};

export const emitTaskAssigned = (userId: string, payload: any) => {
  if (!ioInstance) return;
  
  const socketId = getSocketIdByUser(userId);
  if (socketId) {
    ioInstance.to(socketId).emit("taskAssigned", payload);
  }
};
