import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  onToggle,
  className = ''
}) => {
  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={onToggle}
      title={isDarkMode ? 'Switch to Light Clay Mode' : 'Switch to Dark Clay Mode'}
      className={`group relative flex items-center p-1 rounded-full cursor-pointer transition-all duration-300 neumo-inset ${className}`}
      style={{
        width: '68px',
        height: '34px'
      }}
      aria-label="Toggle Light and Dark Mode"
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] pointer-events-none">
        <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${!isDarkMode ? 'text-amber-500 opacity-100' : 'text-slate-500 opacity-40'}`} />
        <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${isDarkMode ? 'text-indigo-400 opacity-100' : 'text-slate-400 opacity-40'}`} />
      </div>

      {/* Extruded Sliding Neumorphic Knob */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ease-out neumo-card-subtle shadow-md ${
          isDarkMode ? 'translate-x-[34px] bg-[#1a1e30]' : 'translate-x-0 bg-[#e4e7f0]'
        }`}
      >
        {isDarkMode ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
        )}
      </div>
    </button>
  );
};
