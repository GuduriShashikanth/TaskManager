import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants";

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string(),
  priority: z.enum(Object.values(TASK_PRIORITY) as [string, ...string[]]),
  assignedToId: z.string(),
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(Object.values(TASK_PRIORITY) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(TASK_STATUS) as [string, ...string[]]).optional(),
  assignedToId: z.string().optional(),
});

export const TaskQueryDto = z.object({
  status: z.enum(Object.values(TASK_STATUS) as [string, ...string[]]).optional(),
  priority: z.enum(Object.values(TASK_PRIORITY) as [string, ...string[]]).optional(),
  sortByDueDate: z.enum(["asc", "desc"]).optional(),
});
