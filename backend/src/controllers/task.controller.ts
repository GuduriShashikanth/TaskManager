import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from "../dtos/task.dto";
import { createTask, deleteTask, listTasks, updateTask } from "../services/task.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = CreateTaskDto.parse(req.body);
  const task = await createTask(req.userId!, data);
  return ApiResponse.created(res, task, "Task created");
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = UpdateTaskDto.parse(req.body);
  const task = await updateTask(req.params.id, req.userId!, data);

  // emit socket event
  req.app.get("io")?.emit("taskUpdated", task);

  return ApiResponse.success(res, task, "Task updated");
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteTask(req.params.id, req.userId!);
  return ApiResponse.noContent(res);
});

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = TaskQueryDto.parse(req.query);
  const tasks = await listTasks(req.userId!, query);
  return ApiResponse.success(res, tasks, "Tasks retrieved");
});
