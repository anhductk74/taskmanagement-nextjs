"use client";

import { useState } from 'react';
import { ACTION_ICONS } from '@/constants/icons';
import { useTheme } from '@/layouts/hooks/useTheme';
import { useProjectOverview } from '../context/ProjectOverviewContext';
import styles from '../styles/OverviewLayout.module.css';
import { useProject } from '../../components/DynamicProjectProvider';

export function ProjectStatus() {
  const { data, updateProjectStatus, loading } = useProjectOverview();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const statusOptions = [
        {
            value: 'PLANNED',
            label: 'Planned',
            color: 'bg-green-500 border-green-600 text-white',
            bgColor: 'bg-green-500'
        },
        {
            value: 'AT_RISK',
            label: 'At risk',
            color: 'bg-yellow-500 border-yellow-600 text-white',
            bgColor: 'bg-yellow-500'
        },
        {
            value: 'CANCELLED',
            label: 'Cancelled',
            color: 'bg-red-500 border-red-600 text-white',
            bgColor: 'bg-red-500'
        },
        {
            value: 'COMPLETED',
            label: 'Completed',
            color: 'bg-blue-500 border-blue-600 text-white',
            bgColor: 'bg-blue-500'
        },
        {
            value: 'IN_PROGRESS',
            label: 'In progress',
            color: 'bg-purple-500 border-purple-600 text-white',
            bgColor: 'bg-purple-500'
        },
        {
            value: 'BLOCKED',
            label: 'Blocked',
            color: 'bg-gray-500 border-gray-600 text-white',
            bgColor: 'bg-gray-500'
        }
    ];

  const currentStatus = statusOptions.find(s => s.value === data.projectStatus) || statusOptions[0];

  const handleStatusChange = async (newStatus: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED') => {
    await updateProjectStatus(newStatus);
    setIsDropdownOpen(false);
  };

  return (
    <>
        <div className={styles.statusHeader}>
     <span className={`${currentStatus.bgColor} text-white px-2 py-1 rounded text-xs font-medium`}>
  {currentStatus.label}
</span>

            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md transition-colors disabled:opacity-50"
                    style={{
                        color: theme.text.primary,
                        borderColor: theme.border.default,
                        backgroundColor: theme.background.primary
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.background.primary}
                >
                    Update status
                    {isDropdownOpen ? <ACTION_ICONS.arrowUp size={16}/> : <ACTION_ICONS.down size={16}/>}
                </button>

                {isDropdownOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div className="p-1">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleStatusChange(option.value as any)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-color hover:bg-gray-700 hover:text-white ${
                                        option.value === data.projectStatus ? 'bg-gray-700 text-white' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${option.bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`}/>
                                        {option.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className={`${styles.statusContent} ${
            data.projectStatus === 'IN_PROGRESS' ? styles.statusOnTrack :
            data.projectStatus === 'AT_RISK' ? styles.statusAtRisk :
            data.projectStatus === 'COMPLETED' ? styles.statusCompleted :
            data.projectStatus === 'CANCELLED' ? styles.statusCancelled :
            data.projectStatus === 'BLOCKED' ? styles.statusBlocked :
            data.projectStatus === 'PLANNED' ? styles.statusPlanned :
        styles.statusOffTrack
      }`}>
        <div className={styles.statusTitle}>{currentStatus.label}</div>
        <div className={styles.statusDescription}>
            {data.projectStatus === 'PLANNED' && 'This project is planned and not yet started.'}
            {data.projectStatus === 'AT_RISK' && 'This project is at risk of not meeting its goals.'}
            {data.projectStatus === 'IN_PROGRESS' && 'This project is currently being worked on.'}
            {data.projectStatus === 'COMPLETED' && 'This project has been successfully completed.'}
            {data.projectStatus === 'CANCELLED' && 'This project has been cancelled and will not be completed.'}
            {data.projectStatus === 'BLOCKED' && 'This project is currently blocked and cannot proceed.'}

        </div>
        <div className={styles.statusSummary}>
          Summary: This is a sample project status update in Asana. 
          Use status updates to communicate the progress of your project with your teammates.
        </div>
      </div>
    </>
  );
}