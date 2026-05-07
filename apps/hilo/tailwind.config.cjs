/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@games/shell/tailwind-preset')],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/game-shell/src/**/*.{ts,tsx}',
  ],
};
