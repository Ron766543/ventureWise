/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  // these are used dynamically via JS objects so Tailwind can't detect them at build time
  safelist: [
    'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500',
    'bg-emerald-50', 'text-emerald-600',
    'bg-amber-50',   'text-amber-600',
    'bg-blue-50',    'text-blue-600',
    'bg-red-50',     'text-red-600',
    'bg-purple-50',  'text-purple-600',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // keeping emerald as brand but naming it clearly
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },

  plugins: [],
};
