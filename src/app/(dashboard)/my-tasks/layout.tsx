"use client";

import React, { useState } from 'react';
import PageLayout from '@/layouts/page/PageLayout';
import TaskListHeader from '@/components/TaskList/TaskListHeader';
import { useTheme } from '@/layouts/hooks/useTheme';
import { usePathname } from 'next/navigation';
import { Clock } from 'lucide-react';
<<<<<<< HEAD
import { useTasksContext } from '@/contexts';
import { useTasks, useTaskStats } from '@/hooks/useTasks';

=======
import { useTasksContext, type Task } from '@/contexts';
import { useTaskStats } from '@/hooks/useTasks';
import { TaskManagementProvider } from './context/TaskManagementContext';
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
import { Button } from '@/components/ui';

interface MyTaskLayoutProps {
  children: React.ReactNode;
}

function MyTaskContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const { tasks } = useTasks(); // Use SWR hook for actual data
  const { stats: taskStats } = useTaskStats();
  const [searchValue, setSearchValue] = useState("");
  // Removed calendarView state since Week button is removed - always use Month view

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleCreateTask = () => {
    // This will be handled by individual tab components
    console.log('Create task from header');
  };

  // Removed calendar view change handler since Week button is removed

  // Safe props passing - avoid unsafe cloning
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Check if component accepts searchValue prop
      const childType = child.type as any;
      const hasSearchValueProp = childType?.propTypes?.searchValue || 
                                childType?.defaultProps?.hasOwnProperty?.('searchValue');
      
      if (hasSearchValueProp) {
        try {
          return React.cloneElement(child, { searchValue });
        } catch (error) {
          console.warn('Failed to clone element with searchValue:', error);
          return child;
        }
      }
    }
    return child;
  });

  return (
    <>
<<<<<<< HEAD
      {/* Shared Header for all MyTask tabs */}
      <div 
        className="sticky top-0 z-30 shadow-sm border-b" 
        style={{ 
          backgroundColor: theme.background.primary,
          borderColor: theme.border.default,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          width: '100%'
        }}
      >
        {/* Calendar-specific header */}
        {pathname === '/my-tasks/calendar' ? (
          <div className="flex items-center justify-between py-4 px-6">
            {/* Left side - Empty */}
            <div />
            
            {/* Right side - Calendar Controls */}
            <div className="flex items-center gap-2">
              <span 
                className="text-sm px-3 py-1 inline-flex items-center whitespace-nowrap" 
                style={{ color: theme.text.secondary }}
              >
                No date ({tasks?.filter(t => !t.dueDateISO).length || 0})
              </span>
              

              
              <TaskListHeader
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onCreateTask={handleCreateTask}
                onFilterClick={() => {/* Handle filter modal */}}
                onSortClick={() => {/* Handle sort modal */}}
                onGroupClick={() => {/* Handle group modal */}}
                onOptionsClick={() => {/* Handle options modal */}}
                showSearch={true}
                showFilters={true}
                showSort={false}
                showGroup={false}
                showOptions={true}
                className="mb-0 !py-0 !px-0"
                hideLeftSide={true}
              />
=======
      {/* Shared Header for all MyTask tabs - Hide for dashboard */}
      {pathname !== '/my-tasks/dashboard' && (
        <div 
          className="sticky top-0 z-30 shadow-sm border-b" 
          style={{ 
            backgroundColor: theme.background.primary,
            borderColor: theme.border.default,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            width: '100%'
          }}
        >
          {/* Calendar-specific header */}
          {pathname === '/my-tasks/calendar' ? (
            <div className="flex items-center justify-between py-4 px-6">
              {/* Left side - Empty */}
              <div />
              
              {/* Right side - Calendar Controls */}
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm px-3 py-1 inline-flex items-center whitespace-nowrap" 
                  style={{ color: theme.text.secondary }}
                >
                  No date ({tasks.filter((t: Task) => !t.dueDateISO).length})
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Button clicked! Current pathname:', pathname);
                    handleCalendarViewChange();
                  }}
                  leftIcon={<Clock className="w-4 h-4" />}
                >
                  {calendarView === 'dayGridMonth' ? 'Month' : 'Week'}
                </Button>
                
                <TaskListHeader
                  searchValue={searchValue}
                  onSearchChange={handleSearchChange}
                  onCreateTask={handleCreateTask}
                  onFilterClick={() => {/* Handle filter modal */}}
                  onSortClick={() => {/* Handle sort modal */}}
                  onGroupClick={() => {/* Handle group modal */}}
                  onOptionsClick={() => {/* Handle options modal */}}
                  showSearch={true}
                  showFilters={true}
                  showSort={false}
                  showGroup={false}
                  showOptions={true}
                  className="mb-0 !py-0 !px-0"
                  hideLeftSide={true}
                />
              </div>
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
            </div>
          ) : (
            <TaskListHeader
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              onCreateTask={handleCreateTask}
              onFilterClick={() => {/* Handle filter modal */}}
              onSortClick={() => {/* Handle sort modal */}}
              onGroupClick={() => {/* Handle group modal */}}
              onOptionsClick={() => {/* Handle options modal */}}
              showSearch={true}
              showFilters={true}
              showSort={pathname !== '/my-tasks/calendar'}
              showGroup={pathname === '/my-tasks/list'}
              showOptions={true}
              className="mb-0"
            />
          )}
        </div>
      )}

      {/* Tab Content - Adjust height for dashboard */}
      <div className={pathname === '/my-tasks/dashboard' ? 'h-[calc(100vh-230px)] overflow-hidden' : 'h-[calc(100vh-228px)] overflow-hidden'}>
        {childrenWithProps}
      </div>
    </>
  );
};

export default function MyTaskLayout({ children }: MyTaskLayoutProps) {
  return (
    <PageLayout>
      <MyTaskContent>
        {children}
      </MyTaskContent>
    </PageLayout>
  );
};

