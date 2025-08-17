"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProject } from '../../components/DynamicProjectProvider';
import TeamMembers from '@/app/(dashboard)/teams/components/TeamMembers';

interface TeamMember {
  id: string;
  role: string;
  avatar?: string;
  email: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  dueDate?: Date;
  status:'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';
}

interface Portfolio {
  id: string;
  name: string;
  color: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';
  owner: TeamMember;
}

interface StatusUpdate {
  id: string;
  type: 'status_update' | 'milestone' | 'activity';
  title: string;
  description: string;
  author: TeamMember;
  timestamp: Date;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';
}

interface ProjectOverviewData {
  description: string;
  members: TeamMember[];
  goals: Goal[];
  portfolios: Portfolio[];
  statusUpdates: StatusUpdate[];
  projectStatus: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';
}

interface ProjectOverviewContextValue {
  data: ProjectOverviewData;
  loading: boolean;
  error: string | null;
  
  // Actions
  updateDescription: (description: string) => Promise<void>;
  addMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  addStatusUpdate: (update: Omit<StatusUpdate, 'id' | 'timestamp'>) => Promise<void>;
  updateProjectStatus: (status: 'IN_PROGRESS' | 'AT_RISK' | 'PLANNED' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED') => Promise<void>;
}

const ProjectOverviewContext = createContext<ProjectOverviewContextValue | undefined>(undefined);

interface ProjectOverviewProviderProps {
  children: ReactNode;
}

// Mock data

export function ProjectOverviewProvider({ children }: ProjectOverviewProviderProps) {
  const { project } = useProject();
  console.log('ProjectOverviewProvider project:', project);
  const [data, setData] = useState<ProjectOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!project) return;
      setLoading(true);
      try {
        setData({
          description: project.description || "",
          projectStatus: (project.status as any) || "PLANNED",
          members: [
            {
              id: project.pmEmail || "unknown",
              role: project.role || "Member",
              avatar: project.avatarPm || "",
              email: project.pmEmail || "",
            }
          ],
          goals: [],
          portfolios: [],
          statusUpdates: [],
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch overview data");
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, [project]);

  // Actions
  const updateDescription = async (description: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(prev => {
        if (!prev) {
          return {
            description,
            projectStatus: "PLANNED",
            members: [],
            goals: [],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return { ...prev, description };
      });
    } catch (err) {
      setError('Failed to update description');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (member: Omit<TeamMember, 'id'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMember: TeamMember = {
        ...member,
        id: Date.now().toString()
      };
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: "PLANNED",
            members: [newMember],
            goals: [],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return { ...prev, members: [...prev.members, newMember] };
      });
    } catch (err) {
      setError('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: "PLANNED",
            members: [],
            goals: [],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return { ...prev, members: prev.members.filter(m => m.id !== memberId) };
      });
    } catch (err) {
      setError('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString()
      };
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: "PLANNED",
            members: [],
            goals: [newGoal],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return { ...prev, goals: [...prev.goals, newGoal] };
      });
    } catch (err) {
      setError('Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: "PLANNED",
            members: [],
            goals: [],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return {
          ...prev,
          goals: prev.goals.map(goal =>
            goal.id === goalId ? { ...goal, ...updates } : goal
          )
        };
      });
    } catch (err) {
      setError('Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const addStatusUpdate = async (update: Omit<StatusUpdate, 'id' | 'timestamp'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUpdate: StatusUpdate = {
        ...update,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: "PLANNED",
            members: [],
            goals: [],
            portfolios: [],
            statusUpdates: [newUpdate],
          };
        }
        return { ...prev, statusUpdates: [newUpdate, ...prev.statusUpdates] };
      });
    } catch (err) {
      setError('Failed to add status update');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (status: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setData(prev => {
        if (!prev) {
          return {
            description: "",
            projectStatus: status,
            members: [],
            goals: [],
            portfolios: [],
            statusUpdates: [],
          };
        }
        return { ...prev, projectStatus: status };
      });
    } catch (err) {
      setError('Failed to update projects status');
    } finally {
      setLoading(false);
    }
  };

  const value: ProjectOverviewContextValue = {
    data: data || {
      description: "",
      projectStatus: "PLANNED",
      members: [],
      goals: [],
      portfolios: [],
      statusUpdates: [],
    },
    loading,
    error,
    updateDescription,
    addMember,
    removeMember,
    addGoal,
    updateGoal,
    addStatusUpdate,
    updateProjectStatus
  };

  return (
    <ProjectOverviewContext.Provider value={value}>
      {children}
    </ProjectOverviewContext.Provider>
  );
}

export function useProjectOverview() {
  const context = useContext(ProjectOverviewContext);
  if (context === undefined) {
    throw new Error('useProjectOverview must be used within a ProjectOverviewProvider');
  }
  return context;
}