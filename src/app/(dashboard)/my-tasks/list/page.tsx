"use client";

import React, { useState } from "react";
import { GroupedTaskList, TaskListItem } from "@/components/TaskList";
import { TaskDetailPanel } from "@/components/TaskDetailPanel";
<<<<<<< HEAD
import { useTasksContext } from "@/contexts";
import { useMyTasksShared } from "@/hooks/tasks/useMyTasksShared";
=======
import { useTaskActions } from "../hooks";
import { useTasksContext, type Task } from "@/contexts";
import {
  useTasks,
  useUpdateTask,
  useDeleteTask,
  useCreateTask
} from "@/hooks/useTasks";
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d

interface MyTaskListPageProps {
  searchValue?: string;
}

<<<<<<< HEAD
const MyTaskListPage = ({ searchValue = "" }: MyTaskListPageProps) => {
  // MUI DateRangePicker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Get UI state from context
  const { activeFilters } = useTasksContext();
  
  // Use shared hook for all data and actions
  const {
    taskListItems,
    isLoading,
    error,
    actions
  } = useMyTasksShared({
    page: 0,
    size: 1000,
    sortBy: 'startDate',
    sortDir: 'desc',
    searchValue
  });

  // Task management object for compatibility
  const taskManagement = {
    tasks: taskListItems,
    isLoading,
    error: error?.message || null,
    selectedTask: null,
    isPanelOpen: false,
    closeTaskPanel: () => {},
  };

  // MUI DateRangePicker handlers
  const handleCreateTaskWithDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const handleDateRangePickerSave = (data: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    // Create task with proper backend mapping for startDate and deadline
    const taskData = {
      name: 'New Task',
      dueDate: data.endDate || data.startDate || new Date().toISOString().split('T')[0], // deadline field
      startDate: data.startDate || new Date().toISOString().split('T')[0], // startDate field (required)
      endDate: data.endDate || data.startDate || undefined,
      project: '',
      status: 'todo' as const
    };
    
    actions.onCreateTask(taskData);
  };

  // Handle loading and error states
  if (taskManagement.isLoading) {
=======
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
      task.status === "completed"
        ? "done"
        : task.status === "in-progress"
        ? "in_progress"
        : task.status === "pending"
        ? "todo"
        : "todo",
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
      updates.status === "done"
        ? "completed"
        : updates.status === "in_progress"
        ? "in-progress"
        : updates.status === "todo"
        ? "pending"
        : "pending";

    const updateData: Partial<Task> = {
      status: newStatus,
      completed: newStatus === "completed"
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
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
    return (
      <div className="flex items-center justify-center h-64">
        Loading tasks...
      </div>
    );
  }

  if (taskManagement.error) {
    return (
      <div className="flex items-center justify-center h-64">
<<<<<<< HEAD
        <div className="text-red-500">
          Error loading tasks: {taskManagement.error}
        </div>
=======
        Error: {error.message}
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
      </div>
    );
  }

<<<<<<< HEAD
  // Task detail panel logic - Using unified management
  const handleTaskSave = (taskId: string, updates: Partial<TaskListItem>) => {
    // Handle task save from detail panel if needed
    console.log('Task save from detail panel:', taskId, updates);
  };

  const handleTaskDelete = (taskId: string) => {
    // Handle task delete from detail panel if needed
    console.log('Task delete from detail panel:', taskId);
  };

  // Note: GroupedTaskList manages its own search state and has enhanced inline editing

=======
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
  return (
    <>
      <div className="h-full overflow-y-auto">
        <GroupedTaskList
          tasks={taskManagement.tasks}
          config={{
            showSearch: true,
            showFilters: true,
            showSort: true,
            enableGrouping: true,
<<<<<<< HEAD
            defaultGroupBy: 'assignmentDate', // Creates Asana-style sections
            showSelection: true,
=======
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
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
          }}
          actions={{
            ...actions,
            onCreateTask: handleCreateTaskWithDatePicker, // MUI DateRangePicker
          }}
          loading={taskManagement.isLoading}
          error={taskManagement.error ?? undefined}
          hideHeader={true} // Use header from layout.tsx to avoid duplication
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
