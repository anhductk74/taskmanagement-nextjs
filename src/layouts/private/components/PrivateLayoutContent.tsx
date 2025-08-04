"use client";

import React, { useEffect, useState } from "react";
import PrivateHeader from "./PrivateHeader";
import PrivateSidebar from "./PrivateSidebar";
import {
  useLayoutContext,
  useLayoutActions,
} from "../context/PrivateLayoutContext";
import { DetailPanel } from "@/components/DetailPanel";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/auth/firebaseConfig";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PrivateLayoutContentProps {
  children: React.ReactNode;
}

export default function PrivateLayoutContent({
  children,
}: PrivateLayoutContentProps) {
  const { user, isSidebarOpen, isSidebarCollapsed } = useLayoutContext();
  const { toggleSidebar, setSidebarOpen, toggleSidebarCollapse } =
    useLayoutActions();
  const [userAuth, setUserAuth] = useState<any>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    // Check Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUserAuth(userAuth as any);
      } else {
        // If no Firebase user and no NextAuth session, redirect to login
        if (status === "unauthenticated") {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated" && !userAuth) {
    return null; // Will redirect in useEffect
  }

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Header - Fixed at top */}
      <PrivateHeader
        user={user!}
        userAuth={userAuth!}
        onSidebarToggle={toggleSidebar}
        onSidebarCollapseToggle={toggleSidebarCollapse}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <PrivateSidebar
          user={user!}
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={closeSidebar}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main 
            className="flex-1 overflow-auto relative"
            style={{
              overscrollBehavior: 'none',
              overscrollBehaviorX: 'none', 
              overscrollBehaviorY: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >{children}</main>
        </div>

        {/* Detail Panel */}
        <DetailPanel />
      </div>
    </div>
  );
}
