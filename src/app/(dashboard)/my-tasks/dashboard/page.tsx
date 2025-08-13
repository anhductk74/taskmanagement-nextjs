"use client";

import React from "react";
import BarChart from "./components/BarChart";
import DonutChart from "./components/DonutChart";
import AreaCompletionChart from "./components/AreaCompletionChart";
import ProjectTasksChart from "./components/ProjectTasksChart";

const MyTaskDashboardPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-230px)] overflow-y-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 flex flex-col items-center">
          <div className="text-sm text-gray-600 mb-2">
            <h2 className="text-base font-semibold">Total completed tasks</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
          <div className="text-xs text-gray-900">1 Filter</div>
        </div>

        <div className="bg-white rounded-xl border p-4 flex flex-col items-center">
          <div className="text-sm text-gray-600 mb-2">
            <h2 className="text-base font-semibold">Total overdue tasks</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
          
          <div className="text-xs text-gray-900">1 Filter</div>
        </div>

        <div className="bg-white rounded-xl border p-4 flex flex-col items-center">
          <div className="text-sm text-gray-600 mb-2">
            <h2 className="text-base font-semibold">Total incomplete tasks</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
          <div className="text-xs text-gray-900">1 Filter</div>
        </div>

        <div className="bg-white rounded-xl border p-4 flex flex-col items-center">
          <div className="text-sm text-gray-600 mb-2">
            <h2 className="text-base font-semibold">Total tasks</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
          <div className="text-xs text-gray-900">No Filters</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-base font-semibold mb-3">
            Total tasks by section
          </h2>
          <BarChart />
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-base font-semibold mb-3">
            Tasks by completion status
          </h2>
          <DonutChart />
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-base font-semibold mb-3">
            Task completion over time
          </h2>
          <AreaCompletionChart />
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-base font-semibold mb-3">
            Total tasks by project
          </h2>
          <ProjectTasksChart />
        </div>
      </div>
    </div>
  );
};

export default MyTaskDashboardPage;
