export interface CreateProjectFormData {
    name: string;
    description: string;
    startDate: string; // ISO format, e.g., '2025-08-07'
    endDate: string;   // ISO format, e.g., '2025-08-30'
    teamId: number;
    memberIds: number[]; // ID của các thành viên được gán vào project
  }
  