import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../utils/constants";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

interface JwtPayload {
  userId: string;
  role?: UserRole;
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized("Authorization header is missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Invalid authorization format. Use: Bearer <token>");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw ApiError.unauthorized("Token is missing");
    }

    const decoded = jwt.verify(token, config.jwtSecret) as unknown as JwtPayload;

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized("Invalid token"));
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized("Token has expired"));
      return;
    }
    next(ApiError.unauthorized("Authentication failed"));
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      next(ApiError.forbidden("Access denied. No role assigned."));
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      next(ApiError.forbidden("Access denied. Insufficient permissions."));
      return;
    }

    next();
  };
};
