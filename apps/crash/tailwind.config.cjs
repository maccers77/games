/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@games/shell/tailwind-preset')],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/game-shell/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        crashShake: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0)' },
          '20%': { transform: 'translate3d(-3px, 1px, 0) rotate(-1.2deg)' },
          '40%': { transform: 'translate3d(2px, -1px, 0) rotate(1deg)' },
          '60%': { transform: 'translate3d(-2px, 0, 0) rotate(-0.6deg)' },
          '80%': { transform: 'translate3d(2px, 1px, 0) rotate(0.6deg)' },
        },
        kekeBob: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-3px) rotate(0.4deg)' },
        },
        chickenBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        crashShake: 'crashShake 220ms ease-in-out 1',
        kekeBob: 'kekeBob 360ms ease-in-out infinite',
        chickenBob: 'chickenBob 240ms ease-in-out infinite',
      },
    },
  },
};
