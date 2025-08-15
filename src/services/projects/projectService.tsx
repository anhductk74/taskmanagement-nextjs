import { api } from "@/lib/api";
import { CreateProjectApiData } from "@/components/modals/validator/createProjectSchema";
import { usersService, User } from "@/services/users/usersService";

// Types
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

// Project Service Class
class ProjectService {
  private baseUrl = "/api/projects";

  /**
   * Create a new project
   * @param projectData - Project data to create
   * @returns Promise with the created project
   */
  async createProject(projectData: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      console.log("🚀 Creating project:", projectData);
      
      const response = await api.post<CreateProjectResponse>(this.baseUrl, projectData);
      
      console.log("✅ Project created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create project:", error);
      throw error;
    }
  }

  /**
   * Get all projects
   * @returns Promise with array of projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch projects:", error);
      throw error;
    }
  }

  /**
   * Get project by ID
   * @param id - Project ID
   * @returns Promise with the project
   */
  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await api.get<Project>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update project
   * @param id - Project ID
   * @param projectData - Updated project data
   * @returns Promise with the updated project
   */
  async updateProject(id: number, projectData: Partial<CreateProjectRequest>): Promise<Project> {
    try {
      const response = await api.put<Project>(`${this.baseUrl}/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to update project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete project
   * @param id - Project ID
   * @returns Promise<void>
   */
  async deleteProject(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
      console.log(`✅ Project ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`❌ Failed to delete project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get projects by organization
   * @param organizationId - Organization ID
   * @returns Promise with array of projects
   */
  async getProjectsByOrganization(organizationId: number): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(`${this.baseUrl}/organization/${organizationId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch projects for organization ${organizationId}:`, error);
      throw error;
    }
  }

  /**
   * Get projects by owner
   * @param ownerId - Owner ID
   * @returns Promise with array of projects
   */
  async getProjectsByOwner(ownerId: number): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(`${this.baseUrl}/owner/${ownerId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Failed to fetch projects for owner ${ownerId}:`, error);
      throw error;
    }
  }



  /**
   * Get user context for project creation
   * @returns Promise with user context (ownerId, organizationId)
   */
  async getUserContext(): Promise<{ ownerId: number; organizationId: number }> {
    try {
      const currentUser = await usersService.getCurrentUser();
      
      return {
        ownerId: parseInt(currentUser.id) || 1,
        organizationId: 1, // TODO: Get from user's organization
      };
    } catch (error) {
      console.error("❌ Failed to get user context:", error);
      // Return default values if user context fails
      return {
        ownerId: 1,
        organizationId: 1,
      };
    }
  }

  /**
   * Get PM ID from email
   * @param email - Project manager email
   * @returns Promise with PM ID
   */
  async getPMIdFromEmail(email: string): Promise<number> {
    try {
      // Gọi trực tiếp API để lấy user theo email
      const user = await usersService.getUserByEmail(email) as User;
  
      // Nếu có user thì trả về id, không thì 0
      return parseInt(user?.id) || 0;
    } catch (error) {
      console.error("❌ Failed to get PM ID from email:", error);
      return 0; // Default PM ID
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;
