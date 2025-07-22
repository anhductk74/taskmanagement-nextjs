import { Role } from '@/types';

interface Route {
  path: string;
  roles: Role[];
}

export const routes: Record<string, Route> = {
  dashboard: {
    path: '/dashboard',
    roles: ['owner', 'manager', 'leader', 'member'],
  },
  projects: {
    path: '/dashboard/projects',
    roles: ['owner', 'manager', 'leader', 'member'],
  },
  tasks: {
    path: '/dashboard/tasks',
    roles: ['owner', 'manager', 'leader', 'member'],
  },
  reportSummary: {
    path: '/dashboard/owner/report-summary',
    roles: ['owner'],
  },
  teamOverview: {
    path: '/dashboard/manager/team-overview',
    roles: ['manager'],
  },
  taskDistribution: {
    path: '/dashboard/leader/task-distribution',
    roles: ['leader'],
  },
  myTasks: {
    path: '/dashboard/member/my-tasks',
    roles: ['member'],
  },
};

export function hasAccess(role: Role, path: string): boolean {
  const route = Object.values(routes).find(r => r.path === path);
  return route ? route.roles.includes(role) : false;
}

export function getDefaultRouteForRole(role: Role): string {
  switch (role) {
    case 'owner':
      return routes.reportSummary.path;
    case 'manager':
      return routes.teamOverview.path;
    case 'leader':
      return routes.taskDistribution.path;
    case 'member':
      return routes.myTasks.path;
    default:
      return routes.dashboard.path;
  }
}
