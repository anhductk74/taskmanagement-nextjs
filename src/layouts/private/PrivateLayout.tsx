"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { PrivateLayoutProvider } from "./context/PrivateLayoutContext";
import PrivateLayoutContent from "./components/PrivateLayoutContent";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Client-side auth check using authService
    const checkAuth = async () => {
      try {
        // Check if user info exists (non-sensitive data)
        const userInfo = authService.getUserInfo();
        
        if (!userInfo) {
          // Not authenticated, redirect to login
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
        
        // Optional: Check authentication status with backend (if available)
        // This will fall back to userInfo check if backend is not available
        const isAuthenticated = await authService.isAuthenticated();
        
        if (!isAuthenticated) {
          // Authentication failed, clear data and redirect
          await authService.logout();
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
        
        console.log('✅ Authentication check passed for user:', userInfo.email);
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear data and redirect on error
        await authService.logout();
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <PrivateLayoutProvider>
      <PrivateLayoutContent>{children}</PrivateLayoutContent>
    </PrivateLayoutProvider>
  );
}
