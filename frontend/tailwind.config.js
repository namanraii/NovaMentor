/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020817',
          card: '#0a1628',
          border: '#1e3a5f',
          accent: '#00d4ff',
          purple: '#7c3aed',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        display: ["'Inter'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,255,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0,212,255,0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'glow': {
          '0%, 100%': { textShadow: '0 0 8px rgba(0,212,255,0.5)' },
          '50%': { textShadow: '0 0 20px rgba(0,212,255,0.9)' },
        }
      },
      backgroundImage: {
        'cyber-grid': `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    }
  },
  plugins: [],
}
