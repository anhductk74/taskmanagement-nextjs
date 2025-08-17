export interface BaseDetailData {
  id: string;
  title: string;
  type: 'notification' | 'task';
}

export interface NotificationDetailData extends BaseDetailData {
  type: 'notification';
  time: string;
  content: string;
  avatar?: string;
  isRead?: boolean;
  isBookmarked?: boolean;
}

export interface TaskDetailData extends BaseDetailData {
  type: 'task';
  status: string;
  priority: string;
  deadline: string;
  description?: string;
  assignee?: string[];
  project?: string;
}

export type DetailPanelData = NotificationDetailData | TaskDetailData; 