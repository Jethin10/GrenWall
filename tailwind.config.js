/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#08080A',
        surface: '#121214',
        bone: '#F2EFE7',
        muted: '#5F5F5C',
        line: '#242428',
        ember: {
          DEFAULT: '#D8823A',
          soft: 'rgba(216, 130, 58, 0.35)',
          glow: 'rgba(216, 130, 58, 0.16)',
        },
      },
      fontFamily: {
        display: ['"Archivo Variable"', '"Archivo"', 'sans-serif'],
        body: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'ember-radial': 'radial-gradient(circle, rgba(216,130,58,0.24) 0%, rgba(216,130,58,0) 70%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
      },
    },
  },
  plugins: [],
}
