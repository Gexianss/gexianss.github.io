import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [manual, setManual] = useState(() => localStorage.getItem('theme')); // 'dark' | 'light' | null
  const { pathname } = useLocation();
  const defaultTheme = pathname === '/' ? 'dark' : 'light';
  const theme = manual || defaultTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setManual(next);
    localStorage.setItem('theme', next);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
