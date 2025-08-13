"use client";

import { Calendar, Clock, FileText, Mail, User } from "lucide-react";
import { useCreateProjectForm } from "../hooks/useCreateProjectForm";

import { CreateProjectFormData } from "@/types/project";
import { createProject } from "../services";

interface Props {
  onNameChange: (name: string) => void;
}

export default function CreateProjectForm({ onNameChange }: Props) {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    reset,
    today,
    startDateValue,
  } = useCreateProjectForm(onNameChange);
  const handleCreateProject = async (data: CreateProjectFormData) => {
    try {
      const response = await createProject(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-2xl h-fit bg-white rounded-lg p-10">
      <h1 className="text-3xl font-bold mb-1">Create New Project</h1>
      <p className="text-gray-600 mb-6">
        Set up a new project with all the essential details to get started.
      </p>

      <form onSubmit={handleSubmit(handleCreateProject)} className="space-y-10">
        <div>
          <label className="font-medium flex items-center gap-1 mb-1">
            <FileText className="w-4 h-4" /> Project Name *
          </label>
          <input
            {...register("name")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium flex items-center gap-1 mb-1">
            <FileText className="w-4 h-4" /> Description
          </label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            placeholder="Describe the project..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <Calendar className="w-4 h-4" /> Start Date *
            </label>
            <input
              {...register("startDate")}
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              min={today}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <Clock className="w-4 h-4" /> End Date (Optional)
            </label>
            <input
              {...register("endDate")}
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              min={startDateValue || today}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <Mail className="w-4 h-4" /> Project Manager Email *
            </label>
            <input
              {...register("pmEmail")}
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="pm@company.com"
            />
            {errors.pmEmail && (
              <p className="text-red-500 text-sm">{errors.pmEmail.message}</p>
            )}
          </div>
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <User className="w-4 h-4" /> Project Status *
            </label>
            <select
              {...register("status")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option>Planned</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>At Risk</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-500 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
