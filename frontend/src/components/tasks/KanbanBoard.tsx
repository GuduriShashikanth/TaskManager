import { useState } from "react";
import { TaskCard } from "./TaskCard";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  creatorId: string | User;
  assignedToId: string | User;
  createdAt: string;
  updatedAt: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

const columns = [
  { id: "todo", label: "To Do", color: "bg-gray-500" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { id: "review", label: "Review", color: "bg-yellow-500" },
  { id: "completed", label: "Completed", color: "bg-green-500" },
] as const;

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t._id === taskId);
    
    if (task && task.status !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
    
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isOver = dragOverColumn === col.id;
        
        return (
          <div
            key={col.id}
            className={`bg-gray-100 rounded-xl p-4 transition-all duration-200 ${
              isOver ? "ring-2 ring-blue-400 bg-blue-50" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-3 h-3 rounded-full ${col.color}`} />
              <h3 className="font-semibold text-gray-700">{col.label}</h3>
              <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-sm text-gray-600">
                {columnTasks.length}
              </span>
            </div>
            <div className={`space-y-3 min-h-[100px] ${isOver ? "opacity-70" : ""}`}>
              {columnTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDragging={draggedTaskId === task._id}
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                />
              ))}
              {columnTasks.length === 0 && (
                <p className={`text-sm text-gray-500 text-center py-8 ${isOver ? "text-blue-500" : ""}`}>
                  {isOver ? "Drop here" : "No tasks"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
