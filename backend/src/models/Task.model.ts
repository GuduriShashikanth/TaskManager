import mongoose, { Schema, Document } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS, TaskPriority, TaskStatus } from "../utils/constants";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: mongoose.Types.ObjectId;
  assignedToId: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: Object.values(TASK_PRIORITY), required: true },
    status: { type: String, enum: Object.values(TASK_STATUS), default: TASK_STATUS.TODO },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

TaskSchema.index({ assignedToId: 1, status: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>("Task", TaskSchema);
