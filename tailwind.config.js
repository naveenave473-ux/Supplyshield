/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The 7 Signature Feather Palette Swatches:
        // 1: #921CC0 (Electric Violet / Magenta)
        // 2: #4C128A (Royal Violet)
        // 3: #171665 (Midnight Indigo)
        // 4: #1D0445 (Midnight Void Dark Plum)
        // 5: #082495 (Cobalt Blue)
        // 6: #007CB8 (Cerulean Cyan)
        // 7: #0FD3F2 (Bright Neon Cyan)
        palette: {
          violet: '#921CC0',
          royal: '#4C128A',
          indigo: '#171665',
          void: '#1D0445',
          cobalt: '#082495',
          cerulean: '#007CB8',
          cyan: '#0FD3F2',
        },
        primary: {
          DEFAULT: '#0FD3F2',
          hover: '#35DCF5',
          dark: '#007CB8',
          muted: 'rgba(15, 211, 242, 0.70)',
        },
        secondary: {
          DEFAULT: '#921CC0',
          hover: '#A929DB',
          dark: '#4C128A',
          muted: 'rgba(146, 28, 192, 0.70)',
        },
        accent: {
          cyan: '#0FD3F2',
          cerulean: '#007CB8',
          cobalt: '#082495',
          void: '#1D0445',
          indigo: '#171665',
          royal: '#4C128A',
          violet: '#921CC0',
          silver: '#CBD5E1',
        },
        background: {
          DEFAULT: '#1D0445',
          secondary: '#171665',
          tertiary: '#4C128A',
        },
        text: {
          main: '#FFFFFF',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          faint: 'rgba(255, 255, 255, 0.35)',
        },
        status: {
          critical: '#921CC0',
          'critical-bg': 'rgba(146, 28, 192, 0.16)',
          'critical-border': 'rgba(146, 28, 192, 0.40)',
          warning: '#007CB8',
          'warning-bg': 'rgba(0, 124, 184, 0.16)',
          'warning-border': 'rgba(0, 124, 184, 0.40)',
          success: '#0FD3F2',
          'success-bg': 'rgba(15, 211, 242, 0.16)',
          'success-border': 'rgba(15, 211, 242, 0.40)',
          info: '#0FD3F2',
          'info-bg': 'rgba(15, 211, 242, 0.12)',
          'info-border': 'rgba(15, 211, 242, 0.35)',
        },
        glass: {
          base: 'rgba(23, 22, 101, 0.55)',
          surface: 'rgba(29, 4, 69, 0.50)',
          elevated: 'rgba(76, 18, 138, 0.45)',
          light: 'rgba(15, 211, 242, 0.06)',
          strong: 'rgba(29, 4, 69, 0.65)',
          border: 'rgba(15, 211, 242, 0.20)',
          'border-highlight': 'rgba(146, 28, 192, 0.40)',
          'border-subtle': 'rgba(15, 211, 242, 0.10)',
        }
      },
      boxShadow: {
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.6)',
        'glass-md': '0 8px 32px rgba(0, 0, 0, 0.7)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.85)',
        'liquid-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.16)',
        'liquid-strong-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.24), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5)',
        'glow-subtle': '0 0 24px rgba(15, 211, 242, 0.15)',
        'glow-pill': '0 0 14px rgba(15, 211, 242, 0.25)',
        'glow-cyan': '0 0 24px rgba(15, 211, 242, 0.45)',
        'glow-violet': '0 0 24px rgba(146, 28, 192, 0.45)',
        'glow-feather': '0 0 30px rgba(15, 211, 242, 0.25), 0 0 45px rgba(146, 28, 192, 0.25)',
      },
      borderRadius: {
        'glass-sm': '10px',
        'glass-md': '14px',
        'glass-lg': '16px',
        'glass-xl': '24px',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '16px',
        'glass-strong': '40px',
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['Poppins', 'sans-serif'],
        tech: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
