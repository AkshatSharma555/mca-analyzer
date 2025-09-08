import { createContext, useContext } from 'react';

// 1. Ek naya context banayein
const ThemeContext = createContext();

// 2. Ek custom hook banayein taaki is context ko use karna aasan ho jaaye
export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;