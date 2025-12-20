import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

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
import { getSocket, registerSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { KanbanBoard } from "../components/tasks/KanbanBoard";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("asc");

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);
      params.append("sortByDueDate", sortBy);

      const res = await api.get(`/api/tasks?${params}`);
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    registerSocket(user._id);

    socket.on("taskUpdated", (updatedTask: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    });

    socket.on("taskCreated", (newTask: Task) => {
      setTasks((prev) => {
        // Avoid duplicates
        if (prev.some((t) => t._id === newTask._id)) return prev;
        return [...prev, newTask];
      });
    });

    socket.on("taskDeleted", ({ taskId }: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    socket.on("taskAssigned", (payload: { message: string }) => {
      // Show notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Task Assigned", { body: payload.message });
      }
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("taskAssigned");
    };
  }, [user]);

  const handleCreate = async (data: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/tasks", data);
      // Don't add here - socket event will handle it
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await api.put(`/api/tasks/${editingTask._id}`, data);
      // Don't update here - socket event will handle it
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      // Don't remove here - socket event will handle it
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    
    try {
      await api.put(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert on error
      fetchTasks();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <Layout>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks", value: stats.total, color: "bg-blue-500" },
          { label: "To Do", value: stats.todo, color: "bg-gray-500" },
          { label: "In Progress", value: stats.inProgress, color: "bg-yellow-500" },
          { label: "Completed", value: stats.completed, color: "bg-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your team's tasks</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "kanban" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              List
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          sortBy={sortBy}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortChange={setSortBy}
        />
      </div>

      {/* Tasks */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Create your first task to get started</p>
          <Button onClick={() => setIsModalOpen(true)}>Create Task</Button>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard tasks={tasks} onEdit={openEditModal} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden md:table-cell">Priority</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden lg:table-cell">Due Date</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500 sm:hidden">{task.status}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="capitalize text-sm">{task.status.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="capitalize text-sm">{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEditModal(task)} className="text-blue-600 hover:text-blue-700 text-sm mr-3">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask ? "Edit Task" : "Create Task"}>
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </Layout>
  );
}
