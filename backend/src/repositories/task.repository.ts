import { Task } from "../models/Task.model";

export const createTaskRepo = (data: any) => Task.create(data);

export const findTaskByIdRepo = (id: string) => Task.findById(id);

export const deleteTaskRepo = (id: string) => Task.findByIdAndDelete(id);

export const updateTaskRepo = (id: string, data: any) =>
  Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const listTasksRepo = (filter: any, sort: any) =>
  Task.find(filter).sort(sort).populate("assignedToId", "name email");
