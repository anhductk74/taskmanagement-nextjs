export type Role = 'owner' | 'manager' | 'leader' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assigneeId: string;
  projectId: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  teamMembers: string[]; // User IDs
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
