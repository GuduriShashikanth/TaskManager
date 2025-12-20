import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { registerUser, loginUser } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const formatZodErrors = (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = RegisterDto.parse(req.body);
      const { user, token } = await registerUser(data);
      
      return ApiResponse.created(res, {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, "User registered successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.badRequest(res, "Validation failed", formatZodErrors(error));
      }
      next(error);
    }
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = LoginDto.parse(req.body);
      const result = await loginUser(data);
      
      return ApiResponse.success(res, {
        token: result.token,
        user: {
          _id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
      }, "Login successful");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.badRequest(res, "Validation failed", formatZodErrors(error));
      }
      if (error instanceof ApiError) {
        next(error);
        return;
      }
      next(error);
    }
  }
);
