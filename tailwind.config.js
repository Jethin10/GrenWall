/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050506',
        surface: '#0E0E10',
        bone: '#F3EFE6',
        muted: '#5C5C58',
        line: '#202024',
        ember: {
          DEFAULT: '#D8823A',
          soft: 'rgba(216, 130, 58, 0.35)',
          glow: 'rgba(216, 130, 58, 0.16)',
        },
        accretion: {
          deep: '#B8501A',
          mid: '#E8912F',
          hot: '#FFF2DC',
        },
        lensing: '#6E4A9E',
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
