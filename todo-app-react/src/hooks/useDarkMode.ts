import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode() {
  const [storedTheme, setStoredTheme] = useLocalStorage<'light' | 'dark' | null>('theme', null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setStoredTheme(newMode ? 'dark' : 'light');
  };

  return { isDarkMode, toggleDarkMode };
}