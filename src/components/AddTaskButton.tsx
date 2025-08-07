"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateTask from "./Task/CreateTask";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-md w-full sm:w-auto justify-center"
      >
        <Plus size={16} />
        Add Task
      </button>

      {open && <CreateTask onClose={() => setOpen(false)} />}
    </>
  );
}
