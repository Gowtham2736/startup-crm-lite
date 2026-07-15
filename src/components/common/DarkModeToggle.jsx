import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DarkModeToggle({ minimal = false }) {
  const { isDarkMode, toggleTheme } = useTheme();

  if (minimal) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between p-2 rounded-xl transition-all border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/80 cursor-pointer"
      aria-label="Toggle Dark Mode"
    >
      <div className="flex items-center gap-2">
        {isDarkMode ? (
          <>
            <Moon size={18} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun size={18} className="text-amber-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light Mode</span>
          </>
        )}
      </div>
      
      {/* Animated Switch Track */}
      <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
        {/* Switch Thumb */}
        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}
