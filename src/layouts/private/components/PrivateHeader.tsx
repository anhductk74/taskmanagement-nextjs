"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/auth";
import Avatar from "@/components/ui/Avatar/Avatar";
import Dropdown, {
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/Dropdown/Dropdown";

import { auth } from "@/lib/auth/firebaseConfig";
import { signOut as firebaseSignOut } from "firebase/auth";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchPanel from "./SearchPanel";

import NotificationDropdown from "@/layouts/private/components/NotificationDropdown";
import { Notification } from "@/types/notification";
import axios from "axios";

interface PrivateHeaderProps {
  user: User;
  userAuth: any;
  onSidebarToggle: () => void;
  onSidebarCollapseToggle: () => void;
  isSidebarCollapsed: boolean;
}


export default function PrivateHeader({
  user,
  userAuth,
  onSidebarToggle,
  onSidebarCollapseToggle,
  isSidebarCollapsed,
}: PrivateHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth).catch((e) => {
        console.warn("Firebase signOut:", e);
      });
  
      await nextAuthSignOut({ redirect: false }).catch((e) => {
        console.warn("NextAuth signOut:", e);
      });
  
      try {
        localStorage.removeItem("some_custom_token");
      } catch {}
  
      router.replace("/login");
    } catch (err) {
      console.error("Error during signOut:", err);
    }
  };
  

  const handleSearch = (query: string) => {
    // Handle search logic here
    console.log("Searching for:", query);
  };
  const [notifications, setNotifications] = useState<Notification[]>([]);


  useEffect(() => {
    axios.get("/api/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, []);

  const markAsRead = (id: number) => {
    axios.post(`/api/notifications/${id}/read`).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    });
  };

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

  const QuestionIcon = () => (
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
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const MenuIcon = () => (
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
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const SidebarCollapseIcon = () => (
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
        d={
          isSidebarCollapsed
            ? "M13 5l7 7-7 7M6 5l7 7-7 7"
            : "M11 19l-7-7 7-7M18 19l-7-7 7-7"
        }
      />
    </svg>
  );



  return (
    <header className="h-14 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700">
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className="lg:hidden p-1 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <MenuIcon />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={onSidebarCollapseToggle}
          className="hidden lg:flex p-1 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <SidebarCollapseIcon />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src="/logo-white.svg"
            alt="Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Center Section - Search Panel */}
      <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl mx-4">
        <SearchPanel onSearch={handleSearch} />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 flex-1 justify-end">
        {/* Help */}
        <button className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
          <QuestionIcon />
        </button>

       
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />

        {/* User Menu */}
        <Dropdown
          trigger={
            <button className="flex items-center space-x-2 p-1 rounded hover:bg-gray-700 transition-colors">
              <Avatar
                name={userAuth?.displayName}
                src={userAuth?.photoURL}
                size="sm"
                className="ring-2 ring-gray-600"
              />
              <svg
                className="h-3 w-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          }
          placement="bottom-right"
        >
          <div className="p-3 border-b border-gray-200">
            {userAuth && (
              <>
                <p className="font-semibold text-gray-900">{userAuth?.displayName}</p>
                <p className="text-sm text-gray-500">{userAuth?.email}</p>
              </>
            )}
            {session && (
              <>
                <p className="text-sm text-gray-500">{session.user?.email}</p>
              </>
            )}
          </div>

          <DropdownItem>My Profile Settings</DropdownItem>
          <DropdownItem>My Display Picture</DropdownItem>
          <DropdownItem>My Notification Settings</DropdownItem>

          <DropdownSeparator />

          <DropdownItem>Switch Teams</DropdownItem>
          <DropdownItem>Create Team</DropdownItem>

          <DropdownSeparator />

          <DropdownItem>Admin Console</DropdownItem>
          <DropdownItem>Invite Members</DropdownItem>

          <DropdownSeparator />

          <DropdownItem onClick={handleSignOut}>Log out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
