export type ProjectStatus =
  | "Planned"
  | "In Progress"
  | "Blocked"
  | "At Risk"
  | "Completed"
  | "Cancelled";
export type ProjectPriority = "Low" | "Medium" | "High";

export type Project = {
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  description: string;
  startDate: string;
  endDate: string;
  team: string;
  pm: string;
  tasks: string;
  progress: number;
  budget: number;
  spent: number;
  statusNote: string;
  budgetStatus: string;
};
