import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCommentApi } from '@/api/taskCommentApi';
import type { CreateCommentDTO } from '@/types/comment';

export const useTaskComments = (taskId?: string) => {
  return useQuery(
    ['taskComments', taskId],
    () => taskCommentApi.getComments(taskId!),
    {
      enabled: !!taskId,
    }
  );
};

export const useCreateTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateCommentDTO) => taskCommentApi.createComment(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['taskComments', data.taskId]);
      },
    }
  );
};

export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      taskCommentApi.deleteComment(commentId),
    {
      onSuccess: (_, { taskId }) => {
        queryClient.invalidateQueries(['taskComments', taskId]);
      },
    }
  );
};
