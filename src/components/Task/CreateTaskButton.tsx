"use client";

import React from "react";
import clsx from "clsx";
import toast from "react-hot-toast";

type AssigneeType = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

type ProjectType = {
  id: string;
  name: string;
};

interface CreateTaskButtonProps {
  taskName: string;
  description: string;
  assignee: AssigneeType | null;
  project: ProjectType | null;
  onSuccess?: () => void;
}

export default function CreateTaskButton({
  taskName,
  description,
  assignee,
  project,
  onSuccess,
}: CreateTaskButtonProps) {
  const handleCreateTask = () => {
    if (!taskName.trim()) {
      alert("Please enter a task name");
      return;
    }

    const newTask = {
      name: taskName,
      description,
      assignee: assignee?.email || null,
      project: project?.name || null,
      createdAt: new Date().toISOString(),
    };

    console.log("Created Task:", newTask);
    toast.success("Task created successfully!");

    // TODO: replace with API call
    if (onSuccess) onSuccess();
  };

  return (
    <button
      onClick={handleCreateTask}
      disabled={!taskName.trim()}
      className={clsx(
        "px-3 py-1.5 text-sm rounded transition",
        taskName.trim()
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      )}
    >
      Create task
    </button>
  );
}
