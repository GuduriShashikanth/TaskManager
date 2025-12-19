import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../repositories/notification.repository";

export const notifyUser = async (userId: string, message: string) => {
  return createNotification({ userId, message });
};

export const fetchNotifications = async (userId: string) => {
  return getUserNotifications(userId);
};

export const readNotification = async (id: string) => {
  return markAsRead(id);
};
