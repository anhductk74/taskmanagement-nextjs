import {
  ProjectPriority,
  ProjectStatus,
} from "@/app/project-list/types/project.types";
import React from "react";

type ProjectFiltersProps = {
  keyword: string;
  status: "All Status" | ProjectStatus;
  priority: "All Priority" | ProjectPriority;
  onStatusChange: (value: "All Status" | ProjectStatus) => void;
  onPriorityChange: (value: "All Priority" | ProjectPriority) => void;
  onKeywordChange: (value: string) => void;
  onClearFilters: () => void;
};

const statusOptions: ("All Status" | ProjectStatus)[] = [
  "All Status",
  "Planned",
  "In Progress",
  "Blocked",
  "At Risk",
  "Completed",
  "Cancelled",
];

const priorityOptions: ("All Priority" | ProjectPriority)[] = [
  "All Priority",
  "Low",
  "Medium",
  "High",
];

export default function ProjectFilters({
  keyword,
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  onKeywordChange,
  onClearFilters,
}: ProjectFiltersProps) {
  
  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by project or PM..."
        className="border border-gray-200 px-4 py-2 rounded w-full max-w-sm"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value as ProjectFiltersProps["status"])
        }
        className="border border-gray-200 px-4 py-2 rounded-full"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={priority}
        onChange={(e) =>
          onPriorityChange(e.target.value as ProjectFiltersProps["priority"])
        }
        className="border border-gray-200 px-4 py-2 rounded-full"
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Clear filters button */}
      {(status !== "All Status" || priority !== "All Priority") && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 border border border-red-500 text-red-600 px-4 py-2 rounded rounded-full text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-base">×</span> Clear
        </button>
      )}
    </div>
  );
}
