import apiClient from "@/lib/api-client/api-client";
import { CreateProjectFormData } from "@/types/project";

export const createProject = async (data: CreateProjectFormData) => {
  const response = await apiClient.post("/api/projects", data);
  return response.data;
};

