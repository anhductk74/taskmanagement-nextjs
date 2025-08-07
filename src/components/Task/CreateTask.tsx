"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Smile,
  Paperclip,
  Calendar,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useClickAway } from "react-use";
import CreateTaskButton from "./CreateTaskButton";

interface CreateTaskProps {
  onClose: () => void;
}

const MOCK_ASSIGNEES = [
  {
    id: "1",
    name: "Ngoc Lien",
    email: "ngoc.lien@example.com",
    initials: "NL",
  },
  { id: "2", name: "Tuan Anh", email: "tuan.anh@example.com", initials: "TA" },
  {
    id: "3",
    name: "Minh Chau",
    email: "chau.minh@example.com",
    initials: "MC",
  },
];

const MOCK_PROJECTS = [
  { id: "p1", name: "Untitled Project" },
  { id: "p2", name: "UI Redesign" },
  { id: "p3", name: "Marketing Launch" },
];

export default function CreateTask({ onClose }: CreateTaskProps) {
  const [assigneeInput, setAssigneeInput] = useState("");
  const [assignee, setAssignee] = useState<(typeof MOCK_ASSIGNEES)[0] | null>(
    null
  );
  const [project, setProject] = useState<(typeof MOCK_PROJECTS)[0] | null>(
    null
  );
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    onClose();
  });

  const assigneeRef = useRef(null);
  useClickAway(assigneeRef, () => {
    setShowAssigneeDropdown(false);
  });

  const projectRef = useRef(null);
  useClickAway(projectRef, () => {
    setShowProjectDropdown(false);
  });

  const [projectInput, setProjectInput] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div
      ref={ref}
      className="fixed right-16 bottom-0 w-[600px] h-[500px] flex flex-col bg-white rounded-md border border-gray-200 z-[100]"
    >
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">New task</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg font-semibold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      {/* Task Name */}
      <div className="px-4 py-3 space-y-4">
        <div>
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
            className="w-full text-lg font-semibold text-gray-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          For
          {/* Assignee */}
          <div className="relative" ref={assigneeRef}>
            {assignee ? (
              <div className="flex items-center bg-gray-100 rounded px-2 py-1 gap-2">
                <div className="w-6 h-6 rounded bg-sky-400 text-white text-xs font-medium flex items-center justify-center">
                  {assignee.initials}
                </div>
                <span>{assignee.name}</span>
                <button
                  onClick={() => {
                    setAssignee(null);
                    setAssigneeInput("");
                  }}
                  className="text-gray-500 hover:text-black"
                >
                  &times;
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={assigneeInput}
                  onChange={(e) => {
                    setAssigneeInput(e.target.value);
                    setShowAssigneeDropdown(true);
                  }}
                  onFocus={() => setShowAssigneeDropdown(true)}
                  placeholder="Assignee..."
                  className="w-full border border-dashed rounded px-2 py-1 text-sm text-gray-700"
                />

                {showAssigneeDropdown && (
                  <div className="absolute z-50 mt-1 bg-white shadow border rounded w-full max-h-48 overflow-auto">
                    {MOCK_ASSIGNEES.filter(
                      (user) =>
                        user.name
                          .toLowerCase()
                          .includes(assigneeInput.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(assigneeInput.toLowerCase())
                    ).map((user) => (
                      <button
                        key={user.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setAssignee(user);
                          setAssigneeInput("");
                          setShowAssigneeDropdown(false);
                        }}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </button>
                    ))}

                    {MOCK_ASSIGNEES.filter(
                      (user) =>
                        user.name
                          .toLowerCase()
                          .includes(assigneeInput.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(assigneeInput.toLowerCase())
                    ).length === 0 && (
                      <div className="text-gray-400 text-sm px-3 py-2">
                        No results
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          in
          {/* Project */}
          <div className="relative" ref={projectRef}>
            {project ? (
              <div className="flex items-center bg-gray-100 rounded px-2 py-1 gap-2">
                <span>{project.name}</span>
                <button
                  onClick={() => {
                    setProject(null);
                    setProjectInput("");
                  }}
                  className="text-gray-500 hover:text-black"
                >
                  &times;
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={projectInput}
                  onChange={(e) => {
                    setProjectInput(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  onFocus={() => setShowProjectDropdown(true)}
                  placeholder="Project..."
                  className="w-full border border-dashed rounded px-2 py-1 text-sm text-gray-700"
                />

                {showProjectDropdown && (
                  <div className="absolute z-50 mt-1 bg-white shadow border rounded w-full max-h-48 overflow-auto">
                    {MOCK_PROJECTS.filter((proj) =>
                      proj.name
                        .toLowerCase()
                        .includes(projectInput.toLowerCase())
                    ).map((proj) => (
                      <button
                        key={proj.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setProject(proj);
                          setShowProjectDropdown(false);
                          setProjectInput("");
                        }}
                      >
                        {proj.name}
                      </button>
                    ))}

                    {MOCK_PROJECTS.filter((proj) =>
                      proj.name
                        .toLowerCase()
                        .includes(projectInput.toLowerCase())
                    ).length === 0 && (
                      <div className="text-gray-400 text-sm px-3 py-2">
                        No results
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Dropdown project */}
            {showProjectDropdown && (
              <div className="absolute z-50 mt-1 bg-white shadow border rounded w-48">
                {MOCK_PROJECTS.map((proj) => (
                  <button
                    key={proj.id}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setProject(proj);
                      setShowProjectDropdown(false);
                    }}
                  >
                    {proj.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Decription */}
        <div className="flex-1 overflow-y-auto">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full h-full resize-none text-sm text-gray-700 focus:outline-none placeholder:text-gray-400"
            placeholder="Decription"
          />
        </div>
      </div>

      <div className="px-4 pb-3 pt-1 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between">
          {/* Icon bar */}
          <div className="flex items-center gap-2 text-gray-500">
            <Plus size={18} />
            <AlertTriangle size={18} />
            <Smile size={18} />
            <Paperclip size={18} />
            <Sparkles size={18} />
            <Calendar size={18} />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium">
              NL
            </div>
            <Plus size={18} className="text-gray-400" />
            <CreateTaskButton
              taskName={taskName}
              description={description}
              assignee={assignee}
              project={project}
              onSuccess={() => {
                setTaskName("");
                setDescription("");
                setAssignee(null);
                setProject(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
