<<<<<<< HEAD
import { useEffect, useState } from "react";

export function useTheme(key = "theme", defaultTheme = "dark") {
  const [theme, setTheme] = useState<"light" | "dark">();

  useEffect(() => {
    const storedTheme = localStorage.getItem(key) as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.remove("light", "dark");
=======
import { useEffect, useState } from 'react';

export function useTheme(key = 'theme', defaultTheme = 'dark') {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem(key) as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.remove('light', 'dark');
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
      document.documentElement.classList.add(storedTheme);
    } else {
      document.documentElement.classList.add(defaultTheme);
    }
  }, [key, defaultTheme]);

<<<<<<< HEAD
  const updateTheme = (newTheme: "light" | "dark") => {
    localStorage.setItem(key, newTheme);
    document.documentElement.classList.remove("light", "dark");
=======
  const updateTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem(key, newTheme);
    document.documentElement.classList.remove('light', 'dark');
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
    document.documentElement.classList.add(newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
<<<<<<< HEAD
    const newTheme = theme === "light" ? "dark" : "light";
=======
    const newTheme = theme === 'light' ? 'dark' : 'light';
>>>>>>> 76874d89e9a9b15cf12e4cc0defe59593994d24d
    updateTheme(newTheme);
  };

  return { theme, setTheme: updateTheme, toggleTheme };
}
