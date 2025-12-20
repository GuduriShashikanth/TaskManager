import { Response, NextFunction } from "express";
import * as z from "zod";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from "../dtos/task.dto";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../services/task.service";
import { notifyUser } from "../services/notification.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  emitTaskCreated,
  emitTaskDeleted,
} from "../sockets/socket.service";

export const create = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = CreateTaskDto.parse(req.body);
      const task = await createTask(req.userId!, data);

      // Emit socket event for real-time update
      emitTaskCreated(task);

      // Notify assigned user
      if (data.assignedToId !== req.userId) {
        await notifyUser(
          data.assignedToId,
          `You have been assigned a new task: ${data.title}`
        );
      }

      return ApiResponse.created(res, task, "Task created");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.badRequest(res, "Validation failed", error.issues);
      }
      next(error);
    }
  }
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = UpdateTaskDto.parse(req.body);
      const task = await updateTask(req.params.id, req.userId!, data);
      // Socket events are emitted in the service
      return ApiResponse.success(res, task, "Task updated");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.badRequest(res, "Validation failed", error.issues);
      }
      next(error);
    }
  }
);

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteTask(req.params.id, req.userId!);

  // Emit socket event for real-time update
  emitTaskDeleted(req.params.id);

  return ApiResponse.noContent(res);
});

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const query = TaskQueryDto.parse(req.query);
      const tasks = await listTasks(req.userId!, query);
      return ApiResponse.success(res, tasks, "Tasks retrieved");
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.badRequest(res, "Validation failed", error.issues);
      }
      next(error);
    }
  }
);
