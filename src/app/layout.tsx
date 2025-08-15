import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { DetailPanelProvider } from "@/contexts/DetailPanelContext";
import { AppProvider } from "@/contexts/AppProvider";
import { NextAuthProvider } from "@/providers";
<<<<<<< HEAD
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
=======
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "TaskManager - Project Management Made Simple",
  description:
    "Streamline your projects management with our comprehensive task management solution. Built for teams of all sizes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
<<<<<<< HEAD
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
=======
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
      >
        <NextAuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="taskmanagement-theme">
            <AppProvider>
              <DetailPanelProvider>{children}</DetailPanelProvider>
            </AppProvider>
          </ThemeProvider>
        </NextAuthProvider>

      </body>
    </html>
  );
}
