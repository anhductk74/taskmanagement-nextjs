// components/NotificationDropdown.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";
import { Notification } from "@/types/notification";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown/Dropdown";
import { Bell } from "lucide-react";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const BellIcon = () => (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-3.5-3.5a.5.5 0 010-.7l3.5-3.5H15m0 8v-8"
      />
    </svg>
  );

  return (
    <Dropdown
      trigger={
        <button className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      }
      placement="bottom-right"
    >
        <div className="w-[420px] bg-white shadow-lg rounded-xl">
      <div className="p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Thông báo</h3>
      </div>
      {notifications.length === 0 ? (
        <div className="px-4 py-2 text-sm text-gray-500">Không có thông báo mới</div>
      ) : (
        notifications.map((n) => (
          <DropdownItem
            key={n.id}
            className={clsx(
              "flex items-start gap-3 px-4 py-3",
              !n.isRead ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"
            )}
            onClick={() => onMarkAsRead?.(n.id)}
          >
            
            <div
              className={clsx(
                "w-2 h-2 rounded-full mt-1",
                n.isRead ? "bg-gray-300" : "bg-blue-500"
              )}
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{n.content}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
          </DropdownItem>
          ))
        )}
      </div>
    </Dropdown>
  );
}
