// types.ts
export enum TaskStatus {
  TO_DO = 'TO_DO',
  BLOCKED = 'BLOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  TESTING = 'TESTING',
  DONE = 'DONE'
}

export interface Task {
  id: number
  title: string
  description?: string
  dueDateISO?: string;
  priority: 'Low' | 'Medium' | 'High'
  status: TaskStatus
  pending: boolean // true for TO_DO and IN_PROGRESS, false for DONE
  assignee: string[]
  dueDate: string
}

export interface EditableTask extends Omit<Task, 'status'> {
  id: number
  status: TaskStatus
  isEditing?: {
    name?: boolean
    assignee?: boolean
    dueDate?: boolean
    priority?: boolean
    status?: boolean
  }
}

// DTO interfaces for API operations
export interface CreateTaskDTO {
  name: string;
  description?: string;
  assignee?: string[];
  dueDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  status?: TaskStatus;
  projectId?: string;
  tags?: string[];
  estimatedHours?: number;
  pending?: boolean;
}

export interface UpdateTaskDTO {
  name?: string;
  description?: string;
  assignee?: string[];
  dueDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  status?: TaskStatus;
  projectId?: string;
  tags?: string[];
  estimatedHours?: number;
  completedAt?: string | Date;
  pending?: boolean;
}

export interface Assignee {
  id: string
  name: string
  avatar: string
}
  
  