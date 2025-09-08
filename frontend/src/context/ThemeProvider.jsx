import React from 'react';
import ThemeContext from './ThemeContext';
import { useTheme } from '../hooks/useTheme'; // Hamare custom hook ko import karein

const ThemeProvider = ({ children }) => {
  // theme aur toggleTheme ko hook se nikalein
  const { theme, toggleTheme } = useTheme();

  return (
    // Provider component poore application ko theme ki values dega
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;