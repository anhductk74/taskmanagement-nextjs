import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {task.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </span>
        {/* Add assignee avatar here */}
      </div>
    </div>
  );
}
