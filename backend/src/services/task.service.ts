import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import {
  createTaskRepo,
  deleteTaskRepo,
  findTaskByIdRepo,
  listTasksRepo,
  updateTaskRepo,
} from "../repositories/task.repository";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants";

/**
 * Normalize priority to PDF-required enum values
 */
const normalizePriority = (priority: string) => {
  const map: Record<string, string> = {
    low: TASK_PRIORITY.LOW,
    medium: TASK_PRIORITY.MEDIUM,
    high: TASK_PRIORITY.HIGH,
    urgent: TASK_PRIORITY.URGENT,
  };

  const normalized = map[priority.toLowerCase()];
  if (!normalized) {
    throw ApiError.badRequest("Invalid task priority");
  }

  return normalized;
};

/**
 * Normalize status to PDF-required enum values
 */
const normalizeStatus = (status?: string) => {
  if (!status) return TASK_STATUS.TODO;

  const map: Record<string, string> = {
    todo: TASK_STATUS.TODO,
    "in progress": TASK_STATUS.IN_PROGRESS,
    review: TASK_STATUS.REVIEW,
    completed: TASK_STATUS.COMPLETED,
  };

  const normalized = map[status.toLowerCase()];
  if (!normalized) {
    throw ApiError.badRequest("Invalid task status");
  }

  return normalized;
};

/**
 * Create a new task
 */
export const createTask = async (userId: string, data: any) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw ApiError.badRequest("Invalid creator id");
  }

  if (!Types.ObjectId.isValid(data.assignedToId)) {
    throw ApiError.badRequest("Invalid assignedToId");
  }

  return createTaskRepo({
    title: data.title,
    description: data.description,
    dueDate: new Date(data.dueDate),
    priority: normalizePriority(data.priority),
    status: normalizeStatus(data.status),
    creatorId: new Types.ObjectId(userId),
    assignedToId: new Types.ObjectId(data.assignedToId),
  });
};

/**
 * Update an existing task
 */
export const updateTask = async (taskId: string, userId: string, data: any) => {
  const task = await findTaskByIdRepo(taskId);
  if (!task) throw ApiError.notFound("Task not found");

  // Only creator or assignee can update
  if (
    task.creatorId.toString() !== userId &&
    task.assignedToId.toString() !== userId
  ) {
    throw ApiError.forbidden("Not allowed to update this task");
  }

  const updateData: Record<string, unknown> = {};

  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
  if (data.priority) updateData.priority = normalizePriority(data.priority);
  if (data.status) updateData.status = normalizeStatus(data.status);

  if (data.assignedToId) {
    if (!Types.ObjectId.isValid(data.assignedToId)) {
      throw ApiError.badRequest("Invalid assignedToId");
    }
    updateData.assignedToId = new Types.ObjectId(data.assignedToId);
  }

  return updateTaskRepo(taskId, updateData);
};

/**
 * Delete a task (creator only)
 */
export const deleteTask = async (taskId: string, userId: string) => {
  const task = await findTaskByIdRepo(taskId);
  if (!task) throw ApiError.notFound("Task not found");

  if (task.creatorId.toString() !== userId) {
    throw ApiError.forbidden("Only creator can delete task");
  }

  await deleteTaskRepo(taskId);
};

/**
 * List tasks with filters & sorting
 */
export const listTasks = async (userId: string, query: any) => {
  const filter: any = {
    $or: [{ creatorId: userId }, { assignedToId: userId }],
  };

  if (query.status) filter.status = normalizeStatus(query.status);
  if (query.priority) filter.priority = normalizePriority(query.priority);

  const sort =
    query.sortByDueDate === "desc" ? { dueDate: -1 } : { dueDate: 1 };

  return listTasksRepo(filter, sort);
};
