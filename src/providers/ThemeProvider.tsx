// Theme Provider - Global theme context
"use client";

<<<<<<< HEAD
import React, { createContext, useContext, ReactNode } from "react";

import { useTheme } from "@/hooks/useTheme";
=======
import React, { createContext, useContext, ReactNode } from 'react';

import { useTheme } from '@/hooks/useTheme';
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d

interface ThemeContextValue {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
}) => {
<<<<<<< HEAD
=======

>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
  const { theme, setTheme, toggleTheme } = useTheme(storageKey, defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
<<<<<<< HEAD
      <div className={theme}>{children}</div>
=======
      <div className={theme}>
        {children}
      </div>
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
