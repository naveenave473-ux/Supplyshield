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
        // The 7 Signature Palette Swatches:
        // 1: #921CC0 (Electric Violet)
        // 2: #4C128A (Royal Violet)
        // 3: #171665 (Midnight Indigo)
        // 4: #1D0445 (Midnight Void Dark Purple)
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
        background: {
          DEFAULT: '#1D0445', // Swatch 4: Midnight Void
          secondary: '#171665', // Swatch 3: Midnight Indigo
          tertiary: '#4C128A', // Swatch 2: Royal Violet
        },
        primary: {
          DEFAULT: '#0FD3F2', // Swatch 7: Bright Neon Cyan
          hover: '#4AE1F7',
          dark: '#007CB8', // Swatch 6: Cerulean Cyan
        },
        secondary: {
          DEFAULT: '#921CC0', // Swatch 1: Electric Violet
          hover: '#B53DE5',
          dark: '#4C128A', // Swatch 2: Royal Violet
        },
        accent: {
          cyan: '#0FD3F2',     // Swatch 7
          cerulean: '#007CB8', // Swatch 6
          cobalt: '#082495',   // Swatch 5
          void: '#1D0445',     // Swatch 4
          indigo: '#171665',   // Swatch 3
          royal: '#4C128A',    // Swatch 2
          violet: '#921CC0',   // Swatch 1
          silver: '#CBD5E1',   // High-contrast slate typography
        },
        text: {
          main: '#FFFFFF',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        status: {
          success: '#0FD3F2', // Neon Cyan
          'success-bg': 'rgba(15, 211, 242, 0.15)',
          'success-border': 'rgba(15, 211, 242, 0.35)',
          warning: '#007CB8', // Cerulean
          'warning-bg': 'rgba(0, 124, 184, 0.15)',
          'warning-border': 'rgba(0, 124, 184, 0.35)',
          critical: '#921CC0', // Electric Violet
          'critical-bg': 'rgba(146, 28, 192, 0.18)',
          'critical-border': 'rgba(146, 28, 192, 0.45)',
          info: '#0FD3F2',
          'info-bg': 'rgba(15, 211, 242, 0.12)',
          'info-border': 'rgba(15, 211, 242, 0.3)',
        },
        glass: {
          base: 'rgba(23, 22, 101, 0.82)', // Midnight Indigo Glass
          surface: 'rgba(29, 4, 69, 0.85)', // Midnight Void Glass
          elevated: 'rgba(76, 18, 138, 0.75)', // Royal Violet Glass
          border: 'rgba(15, 211, 242, 0.16)', // Neon Cyan fine border
          'border-focus': 'rgba(15, 211, 242, 0.65)',
          'border-highlight': 'rgba(146, 28, 192, 0.35)',
        }
      },
      boxShadow: {
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'glass-md': '0 8px 32px rgba(0, 0, 0, 0.55)',
        'glass-lg': '0 14px 44px rgba(0, 0, 0, 0.7)',
        'neu-raised': '4px 4px 12px rgba(0, 0, 0, 0.65), -2px -2px 8px rgba(15, 211, 242, 0.08)',
        'neu-raised-sm': '2px 2px 8px rgba(0, 0, 0, 0.55), -1px -1px 4px rgba(15, 211, 242, 0.05)',
        'neu-raised-hover': '5px 5px 16px rgba(0, 0, 0, 0.75), -3px -3px 10px rgba(15, 211, 242, 0.15)',
        'neu-inset': 'inset 2px 2px 6px rgba(0, 0, 0, 0.8), inset -2px -2px 6px rgba(146, 28, 192, 0.05)',
        'neu-inset-focus': 'inset 2px 2px 6px rgba(0, 0, 0, 0.85), 0 0 16px rgba(15, 211, 242, 0.4)',
        'glow-cyan': '0 0 28px rgba(15, 211, 242, 0.4)',
        'glow-violet': '0 0 28px rgba(146, 28, 192, 0.4)',
        'glow-cobalt': '0 0 28px rgba(8, 36, 149, 0.4)',
        'glow-cyan-sm': '0 0 14px rgba(15, 211, 242, 0.3)',
      },
      borderRadius: {
        'glass-sm': '12px',
        'glass-md': '18px',
        'glass-lg': '24px',
      },
      backdropBlur: {
        'xs': '4px',
        'glass': '18px',
        'glass-lg': '24px',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        tech: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
