// Permission Management Hook - Ready for Backend Integration
import { useMemo } from 'react';
import { authService } from '@/services/authService';

// Backend role types - match exactly what backend sends
type UserRole = 'admin' | 'owner' | 'pm' | 'leader' | 'member';

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectRoles?: Record<string, string>;
}

interface UsePermissionsProps {
  contextType?: 'project' | 'team' | 'portfolio';
  contextId?: string;
}

export const usePermissions = ({ contextType, contextId }: UsePermissionsProps = {}) => {
  // Get real user data using authService (from cookies/localStorage)
  const getUserFromStorage = (): UserWithRole | null => {
    try {
      const userData = authService.getUserInfo();
      
      if (!userData) {
        return null;
      }
      
      // Use role directly from backend (no frontend mapping)
      const backendRole = userData.roles?.[0] || 'MEMBER';
      // Convert backend role format to lowercase for consistency
      const role = backendRole.toLowerCase(); // OWNER -> owner, PM -> pm, etc.
      
      return {
        id: userData.id?.toString() || '1',
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
        email: userData.email || '',
        role: role as UserRole, // Role directly from backend
        projectRoles: {},
        avatar: userData.avatarUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isFirstLogin: userData.isFirstLogin
      };
    } catch (error) {
      console.error('Error parsing user data from authService:', error);
      return null;
    }
  };

  const user = getUserFromStorage();

  // Get effective role (global or context-specific)
  const effectiveRole = useMemo((): UserRole => {
    if (!user) return 'member';
    
    // If context is specified, check for context-specific role
    if (contextType && contextId && user.projectRoles) {
      const contextRole = user.projectRoles[contextId];
      if (contextRole) return contextRole as UserRole;
    }
    
    // Fall back to global role
    return user.role || 'member';
  }, [user, contextType, contextId]);

  // Role hierarchy matching backend roles
  const roleHierarchy = {
    'member': 1,
    'leader': 2,
    'pm': 3,        // PM from backend
    'owner': 4,
    'admin': 5,
  };

  // Check if user has permission for specific action on resource
  const hasPermission = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (!user) return false;
      
      // Simple permission logic based on role hierarchy
      const userLevel = roleHierarchy[effectiveRole] || 0;
      
      // Basic permissions by role level
      if (userLevel >= 4) return true; // Owner/Admin can do everything
      if (userLevel >= 3 && ['projects', 'teams', 'users'].includes(resource)) return true; // PM
      if (userLevel >= 2 && ['teams'].includes(resource)) return true; // Leader
      if (resource === 'tasks' && action === 'read') return true; // Everyone can read tasks
      
      return false;
    };
  }, [user, effectiveRole, roleHierarchy]);

  // Check if user has any of the specified roles
  const hasRole = useMemo(() => {
    return (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      
      const rolesToCheck = Array.isArray(roles) ? roles : [roles];
      return rolesToCheck.includes(effectiveRole);
    };
  }, [effectiveRole]);

  // Check if user has minimum role level
  const hasMinimumRole = useMemo(() => {
    return (minimumRole: UserRole): boolean => {
      if (!user) return false;
      
      const minimumLevel = roleHierarchy[minimumRole] || 0;
      const userLevel = roleHierarchy[effectiveRole] || 0;
      return userLevel >= minimumLevel;
    };
  }, [user, effectiveRole, roleHierarchy]);

  // Get basic permissions array
  const permissions = useMemo(() => {
    const userLevel = roleHierarchy[effectiveRole] || 0;
    const perms: string[] = [];
    
    if (userLevel >= 4) perms.push('project_management', 'team_management', 'user_management');
    else if (userLevel >= 3) perms.push('project_management', 'team_management', 'user_management');
    else if (userLevel >= 2) perms.push('team_management');
    
    return perms;
  }, [effectiveRole, roleHierarchy]);

  // Role-specific permission checkers
  const can = useMemo(() => ({
    // User management
    manageUsers: hasPermission('users', 'manage'),
    createUsers: hasPermission('users', 'create'),
    updateUsers: hasPermission('users', 'update'),
    deleteUsers: hasPermission('users', 'delete'),
    inviteUsers: hasPermission('users', 'invite'),

    // Project management
    manageProjects: hasPermission('projects', 'manage'),
    createProjects: hasPermission('projects', 'create'),
    updateProjects: hasPermission('projects', 'update'),
    deleteProjects: hasPermission('projects', 'delete'),

    // Task management
    manageTasks: hasPermission('tasks', 'manage'),
    createTasks: hasPermission('tasks', 'create'),
    updateTasks: hasPermission('tasks', 'update'),
    deleteTasks: hasPermission('tasks', 'delete'),
    assignTasks: hasPermission('tasks', 'assign'),

    // Team management
    manageTeams: hasPermission('teams', 'manage'),
    createTeams: hasPermission('teams', 'create'),
    updateTeams: hasPermission('teams', 'update'),
    deleteTeams: hasPermission('teams', 'delete'),

    // Reports
    viewReports: hasPermission('reports', 'read'),
    exportReports: hasPermission('reports', 'export'),

    // Settings
    manageSettings: hasPermission('settings', 'manage'),
    updateSettings: hasPermission('settings', 'update'),

    // Billing
    manageBilling: hasPermission('billing', 'manage'),
    viewBilling: hasPermission('billing', 'read'),

    // Portfolios
    managePortfolios: hasPermission('portfolios', 'manage'),
    createPortfolios: hasPermission('portfolios', 'create'),
    updatePortfolios: hasPermission('portfolios', 'update'),
    deletePortfolios: hasPermission('portfolios', 'delete'),

    // Goals
    manageGoals: hasPermission('goals', 'manage'),
    createGoals: hasPermission('goals', 'create'),
    updateGoals: hasPermission('goals', 'update'),
    deleteGoals: hasPermission('goals', 'delete'),
  }), [hasPermission]);

  // Role level checks using backend roles
  const is = useMemo(() => ({
    admin: hasRole('admin'),
    owner: hasRole('owner'),
    projectManager: hasRole('pm'), // Backend uses 'PM'
    leader: hasRole('leader'),
    member: hasRole('member'),
    
    // Minimum role checks
    atLeastOwner: hasMinimumRole('owner'),
    atLeastProjectManager: hasMinimumRole('pm'), // Backend uses 'PM'
    atLeastLeader: hasMinimumRole('leader'),
  }), [hasRole, hasMinimumRole]);

  return {
    user: user as UserWithRole,
    role: effectiveRole,
    permissions,
    hasPermission,
    hasRole,
    hasMinimumRole,
    can,
    is,
  };
};