import { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

type TaskStatus = "todo" | "in_progress" | "review" | "completed";
type TaskPriority = "low" | "medium" | "high" | "urgent";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  creatorId: string | User;
  assignedToId: string | User;
  createdAt: string;
  updatedAt: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate?.split("T")[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [assignedToId, setAssignedToId] = useState(typeof task?.assignedToId === "object" ? task.assignedToId._id : task?.assignedToId || "");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get("/api/users").then((res) => setUsers(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority, dueDate, assignedToId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} options={statusOptions} />
        <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} options={priorityOptions} />
      </div>
      <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <Select
        label="Assign To"
        value={assignedToId}
        onChange={(e) => setAssignedToId(e.target.value)}
        options={[{ value: "", label: "Select user..." }, ...users.map((u) => ({ value: u._id, label: u.name }))]}
        required
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">{task ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
