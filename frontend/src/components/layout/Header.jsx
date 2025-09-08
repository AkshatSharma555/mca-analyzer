import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    // YAHAN BADLAAV KIYA GAYA HAI:
    // Header ab hamesha brand-blue rahega.
    <header className="bg-brand-blue shadow-lg">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left Side (Logo & Title) */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center text-white font-bold text-lg border border-white/20">
            MCA
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Ministry of Corporate Affairs
            </h1>
            <p className="text-sm text-slate-300">
              e-Consultation Analysis Tool
            </p>
          </div>
        </div>

        {/* Right Side (Theme Toggle) */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-6 h-6" />
            ) : (
              <FiSun className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;