"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, User, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "@/layouts/hooks/useTheme";
import {
  TaskListItem,
  TaskListActions,
  TaskStatus,
  TaskPriority,
} from "./types";
import {
  getPriorityConfig,
  getStatusConfig,
  formatTaskDate,
  isOverdue,
} from "./utils";
import { tasksService } from "@/services/tasks/tasksService";

interface EnhancedTaskRowProps {
  task: TaskListItem;
  actions?: TaskListActions;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
  className?: string;
}

const EnhancedTaskRow = ({
  task,
  actions,
  isSelected = false,
  onSelect,
  className = "",
}: EnhancedTaskRowProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [_startDate, setStartDate] = useState<Date | null>(null);
  const [_endDate, setEndDate] = useState<Date | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const overdueDate = task.deadline && isOverdue(task.deadline);

  useEffect(() => {
    if (editingField && (inputRef.current || selectRef.current)) {
      const element = inputRef.current || selectRef.current;
      element?.focus();
    }
  }, [editingField]);

  const handleRowClick = () => {
    if (!editingField) {
      actions?.onTaskClick?.(task);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(task.id);
  };

  const handleStatusChange = (e: React.MouseEvent) => {
    e.stopPropagation(); // Define the status cycle: TODO -> IN_PROGRESS -> DONE -> TODO
    const statusCycle: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    const currentIndex = statusCycle.indexOf(task.status as TaskStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];
    actions?.onTaskStatusChange?.(task.id, nextStatus);
  };

  const startEditing = (field: string, value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Remove status editing capability
    if (field !== "status") {
      setEditingField(field);
      setEditValue(value);
    }
  };

  const saveEdit = () => {
    if (editingField) {
      // Create update object with the edited field
      const updates: Partial<TaskListItem> = {};

      switch (editingField) {
        case "name":
          if (editValue.trim()) {
            updates.name = editValue.trim();
          }
          break;
        case "project":
          updates.project = editValue.trim() || undefined;
          break;
        case "status":
          updates.status = editValue as TaskStatus;
          break;
        case "priority":
          updates.priority = editValue as TaskPriority;
          break;
        case "deadline":
          updates.deadline = editValue || undefined;
          break;
        case "assignees":
          // Simple implementation - create a single assignee from the input
          if (editValue.trim()) {
            updates.assignees = [
              {
                id: "temp-" + Date.now(),
                name: editValue.trim(),
                email: "",
              },
            ];
          } else {
            updates.assignees = [];
          }
          break;
      }

      // Call the edit action if available, otherwise use specific actions
      if (actions?.onTaskEdit) {
        actions.onTaskEdit({ ...task, ...updates });
      } else {
        // Fallback to specific actions
        switch (editingField) {
          case "status":
            actions?.onTaskStatusChange?.(task.id, editValue as TaskStatus);
            break;
          case "assignees":
            if (editValue.trim()) {
              actions?.onTaskAssign?.(task.id, editValue.trim());
            }
            break;
        }
      }
    }

    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <tr
      className={`group cursor-pointer transition-all duration-200 border-l-2 hover:bg-gray-50 ${className}`}
      style={{
        backgroundColor: isSelected
          ? "rgba(59, 130, 246, 0.08)"
          : isHovered
          ? "rgba(249, 250, 251, 1)"
          : "transparent",
        borderLeftColor: isHovered
          ? "#3b82f6"
          : isSelected
          ? "#3b82f6"
          : "transparent",
        borderLeftWidth: "2px",
      }}
      onClick={handleRowClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Name */}
      <td className="flex-1 min-w-[300px] py-3 px-2">
        <div className="flex items-center gap-3">
          {onSelect && (
            <button
              onClick={handleCheckboxClick}
              className="flex-shrink-0 transition-colors duration-200"
            >
              <CheckCircle
                className={`w-5 h-5 ${
                  task.status === "DONE"
                    ? "text-green-500 fill-current"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              />
            </button>
          )}
          <div className="min-w-0 flex-1">
            {editingField === "name" ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyPress}
                className="w-full font-medium bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none shadow-sm"
                style={{ color: theme.text.primary }}
              />
            ) : (
              <div
                className={`font-medium truncate cursor-text transition-all duration-150 px-2 py-1 rounded min-h-[28px] flex items-center ${
                  task.status === "DONE" ? "line-through text-gray-500" : ""
                } hover:bg-gray-100 hover:shadow-sm`}
                style={{
                  color:
                    task.status === "DONE"
                      ? theme.text.secondary
                      : theme.text.primary,
                  backgroundColor:
                    editingField === "name"
                      ? "rgba(59, 130, 246, 0.05)"
                      : "transparent",
                }}
                onClick={(e) => startEditing("name", task.name, e)}
                title="Click to edit task name"
              >
                {task.name}
              </div>
            )}
            {task.description && (
              <div
                className="text-sm truncate mt-1"
                style={{ color: theme.text.secondary }}
              >
                {task.description}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Due Date */}
      <td className="w-[120px] py-3 px-2">
  {editingField === "dueDate" ? (
    <div className="relative">
      <DatePicker
        startDate={_startDate}
        endDate={_endDate}
        selectsRange
        onChange={(dates) => {
          const [start, end] = dates as [Date | null, Date | null];
          setStartDate(start);
          setEndDate(end);

          if (start && end) {
            // Update khi đã chọn đủ start + end
            tasksService.updateTask(task.id, {
              startDate: start.toLocaleDateString("en-CA"),
              deadline: end.toLocaleDateString("en-CA"),
            });
            actions?.onTaskEdit?.({
              ...task,
              startDate: start.toLocaleDateString("en-CA"),
              deadline: end.toLocaleDateString("en-CA"),
            });
            setEditingField(null); // đóng picker
          }
        }}
        onClickOutside={() => {
          setEditingField(null); // đóng picker
        }}
        className="w-full text-sm bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none shadow-sm"
        placeholderText="Select date range"
        dateFormat="yyyy-MM-dd"
        autoFocus
        open={true}
        popperClassName="react-datepicker-popper-custom"
        popperPlacement="bottom-start"
      />
    </div>
  ) : (
    <div
      className={`text-sm cursor-pointer transition-all duration-150 px-2 py-1 rounded min-h-[28px] flex items-center hover:bg-gray-100 hover:shadow-sm ${
        overdueDate ? "text-red-600 font-medium" : ""
      }`}
      style={{
        color: overdueDate
          ? "#dc2626"
          : task.startDate || task.deadline
          ? theme.text.primary
          : theme.text.secondary,
        backgroundColor:
          editingField === "dueDate"
            ? "rgba(59, 130, 246, 0.05)"
            : "transparent",
      }}
      onClick={(e) => {
        e.stopPropagation();
        const taskStartDate = task.startDate ? new Date(task.startDate) : null;
        const taskEndDate = task.deadline ? new Date(task.deadline) : null;

        setStartDate(taskStartDate);
        setEndDate(taskEndDate);
        setEditingField("dueDate"); // mở picker
      }}
      title="Click to set date range"
    >
      {task.deadline || task.startDate ? formatTaskDate(task) : "Set date"}
    </div>
  )}
</td>


      {/* Collaborators (Assignees) */}
      <td className="w-[150px] py-3 px-2">
        {editingField === "assignees" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyPress}
            className="w-full text-sm bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none shadow-sm"
            placeholder="Type to assign..."
          />
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer transition-all duration-150 px-2 py-1 rounded min-h-[28px] hover:bg-gray-100 hover:shadow-sm"
            style={{
              backgroundColor:
                editingField === "assignees"
                  ? "rgba(59, 130, 246, 0.05)"
                  : "transparent",
            }}
            onClick={(e) =>
              startEditing(
                "assignees",
                task.assignees.length > 0 ? task.assignees[0].name : "",
                e
              )
            }
            title="Click to assign collaborator"
          >
            {task.assignees.length > 0 ? (
              <div className="flex items-center gap-1">
                <User
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: theme.text.secondary }}
                />
                <span
                  className="text-sm truncate"
                  style={{ color: theme.text.primary }}
                >
                  {task.assignees[0].name}
                  {task.assignees.length > 1 &&
                    ` +${task.assignees.length - 1}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <User
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: theme.text.secondary }}
                />
                <span
                  className="text-sm"
                  style={{ color: theme.text.secondary }}
                >
                  Assign
                </span>
              </div>
            )}
          </div>
        )}
      </td>

      {/* Projects */}
      <td className="w-[150px] py-3 px-2">
        {editingField === "project" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyPress}
            className="w-full text-sm bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none shadow-sm"
            placeholder="Add to project..."
          />
        ) : (
          <div
            className="text-sm truncate cursor-pointer transition-all duration-150 px-2 py-1 rounded min-h-[28px] flex items-center hover:bg-gray-100 hover:shadow-sm"
            style={{
              color: task.project ? theme.text.primary : theme.text.secondary,
              backgroundColor:
                editingField === "project"
                  ? "rgba(59, 130, 246, 0.05)"
                  : "transparent",
            }}
            onClick={(e) => startEditing("project", task.project || "", e)}
            title="Click to add to project"
          >
            {task.project || "Add to projects"}
          </div>
        )}
      </td>

      {/* Task Visibility (Status) */}
      <td className="w-[140px] py-3 px-2">
        <button
          type="button"
          onClick={handleStatusChange}
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer hover:opacity-80 hover:shadow-sm ${statusConfig.color}`}
        >
          {statusConfig.label}
        </button>
      </td>
    </tr>
  );
};

export default EnhancedTaskRow;
