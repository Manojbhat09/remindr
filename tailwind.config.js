/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-right': 'slideInFromRight 0.5s ease-out',
        'slide-in-left': 'slideInFromLeft 0.5s ease-out',
        'slide-in-top': 'slideInFromTop 0.5s ease-out',
        'slide-in-bottom': 'slideInFromBottom 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
}

