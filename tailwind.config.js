/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        pasta: '#FACC15',
        chicken: '#FB923C',
        fish: '#38BDF8',
        veggie: '#4ADE80',
        soup: '#C084FC',
        dessert: '#F472B6',
      },
      keyframes: {
        wobble: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-4deg)' },
          '75%': { transform: 'rotate(4deg)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        counterPop: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
      },
      animation: {
        wobble: 'wobble 0.4s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
        popIn: 'popIn 0.35s ease-out forwards',
        counterPop: 'counterPop 0.35s ease-in-out',
      },
    },
  },
  plugins: [],
}
