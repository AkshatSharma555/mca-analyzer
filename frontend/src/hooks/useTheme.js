import { useState, useEffect } from 'react';

// Yeh custom hook theme se judi saari logic ko manage karega
export const useTheme = () => {
  // 1. localStorage se saved theme lo, ya default 'light' rakho
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // 2. Jab bhi theme badle, uski class ko <html> tag par lagao
  // aur localStorage mein save karo
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Theme ko toggle karne ke liye ek function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};