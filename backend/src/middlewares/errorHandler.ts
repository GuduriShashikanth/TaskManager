import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  // Handle ApiError (our custom errors)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Handle Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.name === "MongoServerError" && (err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: object }).keyValue || {})[0];
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { 
      error: err.message,
      stack: err.stack 
    }),
  });
};
