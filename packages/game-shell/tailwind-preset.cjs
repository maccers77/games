/** Shared Tailwind preset for all @games/* apps. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b1220',
          panel: '#111a2e',
          tile: '#1b2742',
          tileHover: '#243358',
          tileSafe: '#0e3a2e',
          tileMine: '#3a0e1c',
        },
        accent: {
          DEFAULT: '#5eead4',
          gold: '#facc15',
          danger: '#f87171',
        },
      },
      fontFamily: {
        display: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 24px -6px rgba(94, 234, 212, 0.55)',
        glowGold: '0 0 28px -6px rgba(250, 204, 21, 0.55)',
        glowDanger: '0 0 28px -6px rgba(248, 113, 113, 0.55)',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bannerIn: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        flip: 'flip 220ms ease-out forwards',
        pop: 'pop 240ms ease-out forwards',
        bannerIn: 'bannerIn 220ms ease-out forwards',
        bob: 'bob 380ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
