/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080807',
        bone: '#E8E8E3',
        paper: '#E8E8E3',
        'gray-1': '#938F8A',
        'gray-2': '#524D47',
        'gray-3': '#393632',
        card: '#181715',
        'card-light': '#DDDDD5',
        hairline: 'rgba(232, 232, 227, 0.14)',
        'hairline-light': 'rgba(8, 8, 7, 0.14)',
      },
      fontFamily: {
        display: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        body: ['"Inter Variable"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
