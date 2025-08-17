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

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date | string;
  endDate?: Date | string;
  dueDate?: Date | string;
  progress?: number;
  budget?: number;
  currency?: string;
  teamId?: string;
  tags?: string[];
  color?: string;
  isPublic?: boolean;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  joinedAt: Date | string;
  permissions?: string[];
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  activeTasks: number;
  totalMembers: number;
  progress: number;
}
export interface CreateProjectFormData {
    name: string;
    description: string;
    startDate: string; // ISO format, e.g., '2025-08-07'
    endDate: string;   // ISO format, e.g., '2025-08-30'
    teamId: number;
    memberIds: number[]; // ID của các thành viên được gán vào project
  }
  

