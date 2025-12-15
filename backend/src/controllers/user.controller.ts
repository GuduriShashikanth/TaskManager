import { Response, NextFunction } from "express";
import * as z from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getProfile, updateProfile, getAllUsers } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const UpdateProfileDto = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
});

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = await getProfile(req.userId!);
    return ApiResponse.success(res, user, "Profile retrieved successfully");
  }
);

export const updateMe = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = UpdateProfileDto.parse(req.body);
      const user = await updateProfile(req.userId!, name);
      return ApiResponse.success(res, user, "Profile updated successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return ApiResponse.badRequest(res, "Validation failed", errors);
      }
      next(error);
    }
  }
);

export const getUsers = asyncHandler(
  async (_req: AuthRequest, res: Response, _next: NextFunction) => {
    const users = await getAllUsers();
    return ApiResponse.success(res, users, "Users retrieved successfully");
  }
);
