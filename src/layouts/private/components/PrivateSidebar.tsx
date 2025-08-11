/**
 * Refactored Private Sidebar Component
 * Clean, optimized với custom hooks và sub-components
 */

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";

// Custom hooks and utilities
import { 
  useSidebarNavigation, 
  useSidebarState, 
  useSidebarDisplay 
} from "../hooks/useSidebarNavigation";

<<<<<<< HEAD
// Components
import SidebarSection from "./SidebarSection";
import SidebarFooter from "./SidebarFooter";
import SidebarNavigationItem from "./SidebarNavigationItem";
=======
// Import global context hooks for data synchronization
import { useProjectsContext, useTasksContext } from "@/contexts";
import { GrProjects } from "react-icons/gr";

>>>>>>> d1d89456fef6613b064af36789695f7d8f213495

// Constants
import { SIDEBAR_CLASSES, NAV_SECTIONS } from "../constants/sidebarConstants";

interface PrivateSidebarProps {
  user: User;
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function PrivateSidebar({
  user,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: PrivateSidebarProps) {
  const pathname = usePathname();

<<<<<<< HEAD
  // Custom hooks for cleaner separation of concerns
  const { navigationSections, rbac, checkItemActive } = useSidebarNavigation();
  const { expandedSections, toggleSection } = useSidebarState(navigationSections);
  const { sidebarWidth, showLabels } = useSidebarDisplay(isCollapsed);
=======
  // Global context data for synchronization with home cards
  const { projects } = useProjectsContext();
  const { taskStats } = useTasksContext();


  // Get user permissions (you can customize this based on your auth system)
  const userPermissions = ["admin"]; // Example: get from user context

  // Get visible sections based on permissions and merge with dynamic data
  const baseSections = getVisibleSections(userPermissions);
  
  // Create dynamic sections with real data
  const sections = baseSections.map(section => {
    // Update My Tasks with real task count
    if (section.id === "main") {
      return {
        ...section,
        items: section.items.map(item => {
          if (item.id === "my-tasks") {
            return {
              ...item,
              badge: {
                count: taskStats.pending || 0,
                color: "default" as const,
              }
            };
          }
          return item;
        })
      };
    }
    
    // Replace static projects section with dynamic projects from global context
    if (section.id === "projects") {

      return {
        ...section,
        items: projects.slice(0, 5).map(project => ({
          id: `project-${project.id}`,
          label: project.name,
          href: `/projects/${project.id}`,
          icon: <GrProjects size={20} className="text-gray-300" />,
          activePattern: `/projects/${project.id}`,
        }))
      };
    }
    
    return section;
  });

  // Use useDisclosure for teams section
  const teamsDisclosure = useDisclosure(false);

  // Initialize expanded sections with default expanded ones
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    return sections
      .filter(section => section.defaultExpanded)
      .map(section => section.id);
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const showLabels = !isCollapsed;
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className={SIDEBAR_CLASSES.BACKDROP}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          SIDEBAR_CLASSES.CONTAINER,
          sidebarWidth,
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Fixed Main Navigation Section */}
        <div className="p-3 border-b border-gray-700">
          {navigationSections
            .filter(section => section.id === NAV_SECTIONS.MAIN)
            .map((section) => (
              <div key={section.id}>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarNavigationItem
                      key={item.id}
                      item={item}
                      isActive={checkItemActive(item, pathname)}
                      isCollapsed={isCollapsed}
                      showLabels={showLabels}
                    />
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 min-h-0">
          {navigationSections
            .filter(section => section.id !== NAV_SECTIONS.MAIN)
            .map((section) => (
              <SidebarSection
                key={section.id}
                section={section}
                isExpanded={expandedSections.includes(section.id)}
                onToggle={toggleSection}
                isCollapsed={isCollapsed}
                showLabels={showLabels}
                pathname={pathname}
                checkItemActive={checkItemActive}
              />
            ))}
        </nav>

        {/* Role-Based Footer */}
        <SidebarFooter 
          showLabels={showLabels} 
          rbac={rbac} 
        />
      </div>
    </>
  );
}