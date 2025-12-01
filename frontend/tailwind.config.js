/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AgriVerse Dark Theme Palette
        background: "#0a0f1c", // Deep dark blue/black
        surface: "#111827",    // Card background
        primary: "#10b981",    // Emerald Green (Success/Action)
        secondary: "#3b82f6",  // Blue (Info/Weather)
        accent: "#f59e0b",     // Amber/Orange (Warnings/Highlights)
        text: {
          primary: "#f3f4f6",  // White/Light Gray
          secondary: "#9ca3af", // Muted Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
