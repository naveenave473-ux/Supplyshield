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
  const { theme, toggleTheme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'labeled') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-white/[0.05] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] text-white'
            : 'bg-black/[0.04] border border-black/10 hover:border-black/20 hover:bg-black/[0.06] text-slate-900'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        type="button"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'bg-white/10 text-white' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isDark ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="text-left">
            <span
              className={`block text-xs font-semibold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span
              className={`text-[10px] ${
                isDark ? 'text-white/50' : 'text-slate-500'
              }`}
            >
              {isDark ? 'Obsidian liquid glass' : 'Frosted ceramic daylight'}
            </span>
          </div>
        </div>

        {/* Toggle switch capsule */}
        <div
          className={`relative w-12 h-6 rounded-full p-0.5 border transition-colors ${
            isDark
              ? 'bg-white/10 border-white/20'
              : 'bg-slate-200 border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
              isDark
                ? 'translate-x-6 bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : 'translate-x-0 bg-amber-400 text-slate-900 shadow-sm'
            }`}
          >
            {isDark ? <Moon className="w-3 h-3 text-black" /> : <Sun className="w-3 h-3 text-slate-900" />}
          </div>
        </div>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? 'bg-white/[0.08] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
            : 'bg-black/[0.06] border border-black/15 shadow-[0_2px_10px_rgba(0,0,0,0.06)]'
        } ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            !isDark
              ? 'theme-toggle-light-btn bg-white text-slate-900 font-semibold shadow-sm ring-1 ring-black/10'
              : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Switch to Light Theme"
        >
          <Sun className={`w-3.5 h-3.5 theme-toggle-sun ${!isDark ? 'text-amber-500' : 'text-white/60'}`} />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            isDark
              ? 'bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.35)]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04]'
          }`}
          title="Switch to Dark Theme"
        >
          <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-black' : 'text-slate-500'}`} />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Default 'icon' button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl transition-all duration-200 group overflow-hidden shadow-sm backdrop-blur-xl cursor-pointer ${
        isDark
          ? 'bg-white/[0.08] border border-white/20 hover:border-white/40 text-white/80 hover:text-white hover:bg-white/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          : 'bg-black/[0.05] border border-black/15 hover:border-black/30 text-slate-700 hover:text-slate-900 hover:bg-black/[0.08]'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} theme (Current: ${isDark ? 'Dark' : 'Light'})`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`w-5 h-5 text-amber-400 absolute transition-all duration-300 ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`w-5 h-5 text-white absolute transition-all duration-300 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>
    </button>
  );
};

