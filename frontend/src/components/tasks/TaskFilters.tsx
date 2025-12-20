import { Select } from "../ui/Select";

interface TaskFiltersProps {
  status: string;
  priority: string;
  sortBy: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const sortOptions = [
  { value: "asc", label: "Due Date (Earliest)" },
  { value: "desc", label: "Due Date (Latest)" },
];

export function TaskFilters({ status, priority, sortBy, onStatusChange, onPriorityChange, onSortChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={status} onChange={(e) => onStatusChange(e.target.value)} options={statusOptions} className="sm:w-40" />
      <Select value={priority} onChange={(e) => onPriorityChange(e.target.value)} options={priorityOptions} className="sm:w-40" />
      <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)} options={sortOptions} className="sm:w-48" />
    </div>
  );
}
