<<<<<<< HEAD
// Task Service - Now uses modular architecture from services/task/
// This file is kept for backward compatibility

// Import everything from the new modular structure
export { 
  taskService,
  taskApi,
  transformBackendTask,
  transformMyTasksSummary,
  transformMyTasksFull,
  debugAuth
} from './task';
=======
// Task Service - Task-related API operations with SWR integration
import { api } from './api';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types';
import {TaskStatus} from '@/types/task';

// Mock data for development
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finalize Q1 project proposal document",
    dueDate: "Today",
    dueDateISO: new Date(),
    completed: false,
    priority: 'High',
    status: TaskStatus.TO_DO,
    hasTag: false,
    projectId: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 2,
    title: "Review design mockups",
    description: "Review and provide feedback on new design mockups",
    dueDate: "Today",
    dueDateISO: new Date(),
    completed: false,
    priority: 'medium',
    status: TaskStatus.TO_DO,
    hasTag: false,
    projectId: 1,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 3,
    title: "Update project documentation",
    description: "Update technical documentation for the project",
    dueDate: "Tomorrow",
    dueDateISO: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completed: false,
    priority: 'low',
    status: TaskStatus.TO_DO,
    hasTag: false,
    projectId: 2,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 4,
    title: "Prepare presentation slides",
    description: "Create slides for client presentation",
    dueDate: "Thursday",
    dueDateISO: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    completed: false,
    priority: 'high',
    status: TaskStatus.TO_DO,
    hasTag: false,
    projectId: 3,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d

// Re-export types for backward compatibility
export type { 
  BackendTask, 
  Task, 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TasksResponse,
  TaskStatsResponse,
  TaskQueryParams,
  BulkTaskUpdate,
  MyTasksSummaryItem,
  MyTasksFullItem,
  PaginatedResponse,
  MyTasksStats
} from '@/types/task';

export type { TaskFilter, TaskSort } from './task';

