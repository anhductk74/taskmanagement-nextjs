import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded p-5 flex flex-col gap-1">
      {/* Title */}
      <div className="text-xs text-gray-500">{title}</div>

      
      <div className="flex items-center justify-between w-full">
        <div className="text-lg font-semibold text-gray-800">{value}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
}
