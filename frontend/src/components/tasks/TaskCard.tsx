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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const statusColors = {
  todo: "bg-gray-500",
  in_progress: "bg-blue-500",
  review: "bg-yellow-500",
  completed: "bg-green-500",
};

export function TaskCard({ task, onEdit, onDelete, isDragging, onDragStart, onDragEnd }: TaskCardProps) {
  const assignee = typeof task.assignedToId === "object" ? task.assignedToId : null;
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== "completed";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-4 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 scale-95 rotate-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-gray-900 line-clamp-2">{task.title}</h3>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${statusColors[task.status]}`} />
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOverdue ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
          {dueDate.toLocaleDateString()}
        </span>
      </div>

      {assignee && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
            {assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{assignee.name}</span>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t">
        <button onClick={() => onEdit(task)} className="flex-1 text-sm text-blue-600 hover:text-blue-700 py-1">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="flex-1 text-sm text-red-600 hover:text-red-700 py-1">
          Delete
        </button>
      </div>
    </div>
  );
}
