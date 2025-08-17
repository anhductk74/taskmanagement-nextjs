"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectService } from '@/services/projects/projectService';
import { useParams } from 'next/navigation';
import { usersService } from '@/services/users/usersService';


interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  pmEmail?: string;
  avatarPm?: string;
  role?: string;
}

interface ProjectContextValue {
  project: Project | null;
  loading: boolean;
  error: string | null;
  updatePageTitle: (title: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

interface DynamicProjectProviderProps {
  children: ReactNode;
}

export function DynamicProjectProvider({ children }: DynamicProjectProviderProps) {
  const params = useParams();
  const projectId = params?.id;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to update page title with retry mechanism
  const updatePageTitle = (title: string) => {
    if (typeof document !== 'undefined') {
      // Update document title immediately
      document.title = `${title} - TaskManager`;
      
      // Function to update header element with retry
      const updateHeaderElement = (retries = 0) => {
        const headerElement = document.querySelector('[data-page-title]');
        if (headerElement) {
          headerElement.textContent = title;
        } else if (retries < 5) {
          // Retry after a short delay if element not found
          setTimeout(() => updateHeaderElement(retries + 1), 100);
        }
      };
      
      // Try immediately and then with retries
      updateHeaderElement();
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('No project ID provided');
        updatePageTitle('Invalid Project');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setProject(null);
        updatePageTitle('Loading Project...');
        const currentProject = await projectService.getProjectById(Number(projectId));
        let pmName = "";
        let pmEmail = "";
        let avatarPm = "";
        let role = "Member"; // Default role
        if (currentProject && currentProject.pmId) {
          try {
           const pmUser = await usersService.getUserById(currentProject.pmId ?? 0);
            pmName = pmUser.name;
            pmEmail = pmUser.email;
            avatarPm = pmUser.avatar || "U";
            role = pmUser.role || "Member"; // Use role from user if available
          } catch (err) {
            console.warn('Không lấy được thông tin PM:', err);
          }
        }
        if (currentProject) {
          setProject({
            ...currentProject,
            id: String(currentProject.id),
            color: "#3b82f6",
            endDate: currentProject.endDate ?? "",
            pmEmail,
            avatarPm,
          });
          setTimeout(() => updatePageTitle(currentProject.name), 50);
        } else {
          setProject(null);
          setError('Project not found');
          setTimeout(() => updatePageTitle('Project Not Found'), 50);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setProject(null);
        setError('Failed to load project');
        setTimeout(() => updatePageTitle('Project Error'), 50);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const value: ProjectContextValue = {
    project,
    loading,
    error,
    updatePageTitle,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a DynamicProjectProvider');
  }
  return context;
}