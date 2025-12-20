import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../repositories/notification.repository";
import { emitTaskAssigned } from "../sockets/socket.service";

export const notifyUser = async (userId: string, message: string) => {
  // Emit real-time notification
  emitTaskAssigned(userId, { message });
  // Save to database
  return createNotification({ userId, message });
};

export const fetchNotifications = async (userId: string) => {
  return getUserNotifications(userId);
};

export const readNotification = async (id: string) => {
  return markAsRead(id);
};
