import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '@/types/task';
import { taskApi } from '@/api/taskApi';

export const useTasks = (projectId?: string) => {
  return useQuery(
    ['tasks', projectId],
    () => taskApi.getTasks(projectId),
    {
      enabled: !!projectId,
    }
  );
};

export const useTask = (taskId?: string) => {
  return useQuery(
    ['task', taskId],
    () => taskApi.getTask(taskId!),
    {
      enabled: !!taskId,
    }
  );
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newTask: CreateTaskDTO) => taskApi.createTask(newTask),
    {
      onSuccess: (data, variables) => {
        // Update tasks list
        queryClient.invalidateQueries(['tasks', variables.projectId]);
        
        // Update project data
        queryClient.invalidateQueries(['project', variables.projectId]);
      },
    }
  );
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ taskId, data }: { taskId: string; data: UpdateTaskDTO }) =>
      taskApi.updateTask(taskId, data),
    {
      onSuccess: (data) => {
        // Update task detail
        queryClient.invalidateQueries(['task', data.id]);
        
        // Update tasks list
        queryClient.invalidateQueries(['tasks', data.projectId]);
        
        // Update project data
        queryClient.invalidateQueries(['project', data.projectId]);
      },
    }
  );
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (taskId: string) => taskApi.deleteTask(taskId),
    {
      onSuccess: (_, taskId) => {
        // Invalidate and refetch tasks list
        queryClient.invalidateQueries(['tasks']);
        
        // Remove task from cache
        queryClient.removeQueries(['task', taskId]);
      },
    }
  );
};
