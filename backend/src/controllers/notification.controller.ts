import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  fetchNotifications,
  readNotification,
} from "../services/notification.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await fetchNotifications(req.userId!);
    return ApiResponse.success(res, data, "Notifications fetched");
  }
);

export const markNotificationRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await readNotification(req.params.id);
    return ApiResponse.noContent(res);
  }
);
