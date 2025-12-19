import { Notification } from "../models/Notification.model";

export const createNotification = (data: {
  userId: string;
  message: string;
}) => {
  return Notification.create(data);
};

export const getUserNotifications = (userId: string) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

export const markAsRead = (id: string) => {
  return Notification.findByIdAndUpdate(id, { read: true });
};
