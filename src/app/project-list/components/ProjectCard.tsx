"use client";

import React from "react";
import { Calendar, FileCheck, User, Users } from "lucide-react";
import { Project } from "../types/project.types";
import { useRouter } from "next/navigation"; 

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project/list`); 
    // router.push(`/project/${project.id}/list`); 
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-lg p-4 min-h-[200px] bg-white flex flex-col space-y-4 hover:bg-gray-100 transition cursor-pointer border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {project.name}
          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
            {project.status}
          </span>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
            {project.priority}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600">{project.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700">
        <div className="flex gap-2 items-center">
          <Calendar size={16} /> {project.startDate} - {project.endDate}
        </div>
        <div className="flex gap-2 items-center">
          <Users size={16} /> {project.team}
        </div>
        <div className="flex gap-2 items-center">
          <User size={14} /> PM: {project.pm}
        </div>
        <div className="flex gap-2 items-center">
          <FileCheck size={14} /> Tasks: {project.tasks}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <p className="text-xs text-gray-600 mb-1">Project Progress</p>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-400 rounded"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-blue-500 mt-1">⚡ {project.statusNote}</p>
      </div>
    </div>
  );
}
