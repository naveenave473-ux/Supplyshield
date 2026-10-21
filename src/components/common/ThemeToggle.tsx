import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'labeled' | 'pill';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'labeled') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-3 rounded-xl neu-raised text-xs font-medium transition-all ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
          </div>
          <div>
            <span className="block font-bold">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            <span className="text-[10px] text-[#BEC7D5]">
              {isDark ? 'High-contrast glassmorphic neon' : 'Frosted ceramic neumorphic'}
            </span>
          </div>
        </div>

        <div className="relative w-11 h-6 rounded-full p-0.5 neu-segmented-container transition-colors">
          <div
            className={`w-5 h-5 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
              isDark
                ? 'translate-x-5 bg-gradient-to-tr from-[#0FD3F2] to-[#921CC0] text-white shadow-[0_0_10px_rgba(15,211,242,0.4)]'
                : 'translate-x-0 bg-[#F59E0B] text-white'
            }`}
          >
            {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </div>
        </div>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div className="flex items-center p-1 rounded-xl neu-segmented-container">
        <button
          onClick={() => isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            !isDark
              ? 'neu-raised text-[#F59E0B] shadow-sm'
              : 'text-[#BEC7D5] hover:text-white'
          }`}
          title="Light Mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          onClick={() => !isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isDark
              ? 'neu-raised text-primary shadow-sm'
              : 'text-[#BEC7D5] hover:text-white'
          }`}
          title="Dark Mode"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Default 'icon' button
  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl neu-raised text-[#BEC7D5] hover:text-white transition-all group overflow-hidden ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`w-5 h-5 text-[#F59E0B] absolute transition-all duration-300 ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-5 h-5 text-primary absolute transition-all duration-300 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>
    </button>
  );
};
