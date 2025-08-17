// Project types from service
import type { CreateProjectApiData } from "@/components/modals/validator/createProjectSchema";

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  ownerId: number;
  emailPm: string;
  organizationId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  pmId?: number; // Optional PM ID
}

export interface CreateProjectRequest extends CreateProjectApiData {}

export interface CreateProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}