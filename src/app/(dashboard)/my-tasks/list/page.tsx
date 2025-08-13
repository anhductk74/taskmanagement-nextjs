"use client";

import React, { useMemo, useState } from "react";
import { TaskList, TaskListItem, TaskStatus } from "@/components/TaskList";
import { TaskDetailPanel } from "@/components/TaskDetailPanel";
import { useTaskActions } from "../hooks";
import { useTasksContext, type Task } from "@/contexts";
import {
  useTasks,
  useUpdateTask,
  useDeleteTask,
  useCreateTask
} from "@/hooks/useTasks";

interface MyTaskListPageProps {
  searchValue?: string;
}

const transformTasksToTaskListItems = (tasks: Task[]): TaskListItem[] => {
  return tasks.map((task) => ({
    id: task.id.toString(),
    name: task.title,
    description: task.description || "",
    assignees: task.assigneeId
      ? [{ id: task.assigneeId, name: "Assigned User", email: "user@example.com" }]
      : [],
    dueDate:
      task.dueDateISO?.toISOString().split("T")[0] ||
      new Date().toISOString().split("T")[0],
    startDate:
      task.dueDateISO?.toISOString().split("T")[0] ||
      new Date().toISOString().split("T")[0],
    endDate:
      task.dueDateISO?.toISOString().split("T")[0] ||
      new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    hasStartTime: false,
    hasEndTime: false,
    priority: task.priority,
    status:
      task.status === "DONE"
        ? "DONE"
        : task.status === "IN_PROGRESS"
        ? "IN_PROGRESS"
        : task.status === "TO_DO"
        ? "TO_DO"
        : "TO_DO",
    pending: task.pending, // Use the pending field from Task
    tags: task.tags || [],
    project: task.hasTag && task.tagText ? task.tagText : "Default Project",
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  }));
};

const MyTaskListPage: React.FC<MyTaskListPageProps> = ({ searchValue = "" }) => {
  const { globalFilters, globalSort } = useTasksContext();
  const { tasks, isLoading, error } = useTasks({
    filter: globalFilters,
    sort: globalSort
  });

  const { updateTask: updateTaskMutation } = useUpdateTask();
  const { deleteTask: deleteTaskMutation } = useDeleteTask();
  const { createTask: createTaskMutation } = useCreateTask();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const taskListItems = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return transformTasksToTaskListItems(tasks);
  }, [tasks]);

  const selectedTask = useMemo(
    () => taskListItems.find((task) => task.id === selectedTaskId),
    [taskListItems, selectedTaskId]
  );

  // --- Handlers ---
  const updateTaskHandler = async (
    taskId: string,
    updates: Partial<TaskListItem>
  ) => {
    const newStatus =
      updates.status === "DONE"
        ? "DONE"
        : updates.status === "IN_PROGRESS"
        ? "IN_PROGRESS"
        : updates.status === "TO_DO"
        ? "TO_DO"
        : "TO_DO";

    const updateData: Partial<Task> = {
      status: newStatus,
      pending: newStatus !== "DONE" // pending = true for TO_DO/in-progress, false for DONE
    };

    if (updates.name !== undefined) updateData.title = updates.name;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.priority !== undefined)
      updateData.priority = updates.priority as Task["priority"];

    await updateTaskMutation({ id: taskId, data: updateData });
  };

  const bulkUpdateTasksHandler = async (
    taskIds: string[],
    updates: Partial<TaskListItem>
  ) => {
    await Promise.all(taskIds.map((taskId) => updateTaskHandler(taskId, updates)));
  };

  const moveTaskToStatusHandler = async (
    taskId: string,
    newStatus: TaskStatus
  ) => {
    await updateTaskHandler(taskId, { status: newStatus });
  };

  const deleteTaskHandler = async (taskId: string) => {
    await deleteTaskMutation(taskId);
  };

  const createTaskHandler = async (task: Partial<TaskListItem>) => {
    await createTaskMutation(task);
  };

  // --- Memoized management object ---
  const taskManagement = useMemo(
    () => ({
      tasks: taskListItems,
      selectedTask,
      isPanelOpen,
      isLoading,
      error: error?.message || null,
      openTaskPanel: (taskIdOrTask: string | TaskListItem) => {
        const taskId =
          typeof taskIdOrTask === "string" ? taskIdOrTask : taskIdOrTask.id;
        setSelectedTaskId(taskId);
        setIsPanelOpen(true);
      },
      closeTaskPanel: () => {
        setSelectedTaskId(null);
        setIsPanelOpen(false);
      },
      updateTask: updateTaskHandler,
    bulkUpdateTasks: bulkUpdateTasksHandler,
    moveTaskToStatus: moveTaskToStatusHandler,
    deleteTask: deleteTaskHandler,
    addTask: createTaskHandler
    }),
    [taskListItems, selectedTask, isPanelOpen, isLoading, error]
  );

  const taskActions = useTaskActions({ taskActions: taskManagement });

  // --- UI ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        Error: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <TaskList
          tasks={taskManagement.tasks}
          config={{
            showSearch: true,
            showFilters: true,
            showSort: true,
            enableGrouping: true,
            defaultGroupBy: "assignmentDate",
            showSelection: true,
            columns: [
              { key: "name", label: "Name", width: "flex-1 min-w-[300px]", sortable: true },
              { key: "dueDate", label: "Due date", width: "w-[120px]", sortable: true },
              { key: "assignees", label: "Collaborators", width: "w-[150px]", sortable: false },
              { key: "project", label: "Projects", width: "w-[150px]", sortable: true },
              { key: "status", label: "Task visibility", width: "w-[140px]", sortable: true },
              { key: "actions", label: "+", width: "w-[50px]", sortable: false }
            ]
          }}
          actions={taskActions}
          loading={taskManagement.isLoading}
          error={taskManagement.error ?? undefined}
          hideHeader={true}
        />
      </div>

      <TaskDetailPanel
        task={taskManagement.selectedTask}
        isOpen={taskManagement.isPanelOpen}
        onClose={taskManagement.closeTaskPanel}
        onSave={taskManagement.updateTask}
        onDelete={taskManagement.deleteTask}
      />
    </>
  );
};

export default MyTaskListPage;
