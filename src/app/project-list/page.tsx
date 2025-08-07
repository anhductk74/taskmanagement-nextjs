"use client";

import React, { useState } from "react";

import { PrivateLayout } from "@/layouts";
import { useTheme } from "@/layouts/hooks/useTheme";
import ProjectFilters from "@/components/ProjectFilters";

import ProjectCard from "./components/ProjectCard";
import { Project, ProjectPriority, ProjectStatus } from "./types/project.types";
import { projects } from "./data/projects";
import CreateProjectButton from "@/components/CreateProjectButton";

const ProjectListPage = () => {
  const { theme } = useTheme();

  const [status, setStatus] = useState<"All Status" | ProjectStatus>(
    "All Status"
  );
  const [priority, setPriority] = useState<"All Priority" | ProjectPriority>(
    "All Priority"
  );
  const [keyword, setKeyword] = useState("");

  const handleClearFilters = () => {
    setStatus("All Status");
    setPriority("All Priority");
    setKeyword("");
  };

  const filteredProjects: Project[] = projects.filter((p) => {
    const matchesStatus = status === "All Status" || p.status === status;
    const matchesPriority =
      priority === "All Priority" || p.priority === priority;
    const matchesKeyword =
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.pm.toLowerCase().includes(keyword.toLowerCase());
    return matchesStatus && matchesPriority && matchesKeyword;
  });

  return (
    <PrivateLayout>
      <div
        className="h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: theme.background.primary }}
      >
        {/* Header + Stats + Filters */}
        <div className="flex-shrink-0 px-8 py-6 space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1
                className="text-4xl font-semibold"
                style={{ color: theme.text.primary }}
              >
                All Projects
              </h1>
              <p className="text-sm" style={{ color: theme.text.secondary }}>
                Manage and track all company projects efficiently
              </p>
            </div>
            <div>
              {" "}
              <CreateProjectButton variant="solid" />
            </div>
          </div>

          {/* Filters */}
          <ProjectFilters
            keyword={keyword}
            status={status}
            priority={priority}
            onStatusChange={(value) => setStatus(value)}
            onPriorityChange={(value) => setPriority(value)}
            onKeywordChange={(value) => setKeyword(value)}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Scrollable Project List */}
        <div className="flex-1 overflow-y-auto px-16 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-10">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default ProjectListPage;
