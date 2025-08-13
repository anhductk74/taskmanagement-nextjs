import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { DetailPanelProvider } from "@/contexts/DetailPanelContext";
import { AppProvider } from "@/contexts/AppProvider";
import { NextAuthProvider } from "@/providers";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "TaskManager - Project Management Made Simple",
  description:
    "Streamline your project management with our comprehensive task management solution. Built for teams of all sizes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <NextAuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="taskmanagement-theme">
            <AppProvider>
              <DetailPanelProvider>
                {children}
              </DetailPanelProvider>
            </AppProvider>
          </ThemeProvider>
        </NextAuthProvider>

      </body>
    </html>
  );
}
