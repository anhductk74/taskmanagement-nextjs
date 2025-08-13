/**
 * Custom Hook for Sidebar Navigation Logic
 * Tách logic phức tạp ra khỏi component chính
 */

import { useMemo, useCallback, useEffect } from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { useProjectsContext } from '@/contexts';
import { useTaskStats } from '@/hooks/useTasks';
import { 
  getVisibleNavigationSections,
  type NavigationSection 
} from '@/config/rbac-navigation';
import {
  createRoleChecks,
  getProjectTitleByRole,
  filterProjectsByRole,
  shouldShowProjectsSection,
  shouldShowTeamsSection,
  createProjectNavItems,
  createTeamNavItems,
  isItemActive,
} from '../helpers/sidebarHelpers';
import { NAV_SECTIONS } from '../constants/sidebarConstants';
import React from 'react';
import { GrProjects } from "react-icons/gr";
import { Users } from 'lucide-react';

export function useSidebarNavigation() {
  
  // Get RBAC data and contexts
  const rbac = useRBAC();
  const { projects } = useProjectsContext();
  
  // Use SWR hook for task stats instead of context
  const { stats: taskStats } = useTaskStats();

  // Debug: Track when taskStats changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Sidebar Navigation - taskStats changed:', taskStats);
      console.log('🔄 Sidebar Navigation - byStatus changed:', taskStats?.byStatus);
      console.log('🔄 Sidebar Navigation - TO_DO count changed to:', taskStats?.byStatus?.TO_DO);
      console.log('🔄 Sidebar Navigation - Component re-rendering due to taskStats change');
      
      // Add test button to console for manual testing
      console.log('🧪 Test: To manually test revalidateTaskStats, run: window.testRevalidateStats()');
      (window as any).testRevalidateStats = () => {
        console.log('🧪 Manual test: Calling revalidateTaskStats');
        import('@/hooks/useTasks').then(({ revalidateTaskStats }) => {
          revalidateTaskStats();
        });
      };
    }
  }, [taskStats]);

  // Create role checks object (memoized)
  const roleChecks = useMemo(() => createRoleChecks(rbac), [rbac]);

  // Get base navigation sections
  const baseNavigationSections = useMemo(() => {
    return getVisibleNavigationSections(rbac.user);
  }, [rbac.user]);

  // Process navigation sections with dynamic data
  const navigationSections = useMemo(() => {
    // Debug: Log taskStats to see what's available
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Sidebar Navigation - navigationSections memo recalculating');
      console.log('🔄 Sidebar Navigation - taskStats:', taskStats);
      console.log('🔄 Sidebar Navigation - byStatus:', taskStats?.byStatus);
      console.log('🔄 Sidebar Navigation - TO_DO count:', taskStats?.byStatus?.TO_DO);
      console.log('🔄 Sidebar Navigation - Dependencies changed, recalculating...');
    }
    
    return baseNavigationSections.map(section => {
      // Update My Tasks with real task count
      if (section.id === NAV_SECTIONS.MAIN) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === "my-tasks") {
              // Use the correct TaskStatus enum value 'TO_DO'
              const todoCount = taskStats?.byStatus?.TO_DO || 0;
              
              // Debug: Log badge count calculation
              if (process.env.NODE_ENV === 'development') {
                console.log('🔄 My Tasks Badge - TO_DO count:', todoCount);
                console.log('🔄 My Tasks Badge - all byStatus keys:', Object.keys(taskStats?.byStatus || {}));
                console.log('🔄 My Tasks Badge - byStatus values:', taskStats?.byStatus);
              }
              
              return {
                ...item,
                badge: {
                  count: todoCount,
                  color: "default" as const,
                }
              };
            }
            return item;
          })
        };
      }
      
      // Process Projects section (only for MEMBER and LEADER)
      if (section.id === NAV_SECTIONS.PROJECTS && shouldShowProjectsSection(roleChecks)) {
        const filteredProjects = filterProjectsByRole(projects, roleChecks);
        const projectTitle = getProjectTitleByRole(roleChecks);
        
        return {
          ...section,
          title: projectTitle,
          items: filteredProjects.slice(0, 5).map(project => ({
            id: `project-${project.id}`,
            label: project.name,
            href: `/projects/${project.id}`,
            icon: React.createElement(GrProjects, { size: 20, className: "text-gray-300" }),
            allowedRoles: section.allowedRoles,
          }))
        };
      }

      // Process Teams section (only for MEMBER and LEADER)  
      if (section.id === NAV_SECTIONS.TEAMS && shouldShowTeamsSection(roleChecks)) {
        const teamNavItems = createTeamNavItems();
        
        return {
          ...section,
          items: teamNavItems.map(team => ({
            ...team,
            icon: React.createElement(Users, { size: 20, className: "text-gray-300" }),
          }))
        };
      }
      
      return section;
    });
  }, [baseNavigationSections, roleChecks, taskStats?.byStatus?.TO_DO, projects]);

  // Check if item is active (memoized with useCallback)
  const checkItemActive = useCallback((item: any, pathname: string) => {
    return isItemActive(item, pathname);
  }, []);

  return {
    navigationSections,
    roleChecks,
    rbac,
    checkItemActive,
  };
}

/**
 * Hook for sidebar state management
 */
export function useSidebarState(navigationSections: NavigationSection[]) {
  // Memoize default expanded sections based on section structure
  const defaultExpandedSections = useMemo(() => {
    return navigationSections
      .filter(section => section.defaultExpanded)
      .map(section => section.id);
  }, [navigationSections.map(s => `${s.id}-${s.defaultExpanded}`).join(',')]);

  const [expandedSections, setExpandedSections] = React.useState<string[]>(
    () => defaultExpandedSections
  );

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  // Update expanded sections when navigation structure changes
  React.useEffect(() => {
    setExpandedSections(defaultExpandedSections);
  }, [defaultExpandedSections]);

  return {
    expandedSections,
    toggleSection,
  };
}

/**
 * Hook for sidebar dimensions and display logic
 */
export function useSidebarDisplay(isCollapsed: boolean) {
  const sidebarWidth = useMemo(() => {
    return isCollapsed ? "w-16" : "w-64";
  }, [isCollapsed]);

  const showLabels = useMemo(() => {
    return !isCollapsed;
  }, [isCollapsed]);

  return {
    sidebarWidth,
    showLabels,
  };
}