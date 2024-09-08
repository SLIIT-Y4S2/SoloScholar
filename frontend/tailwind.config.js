/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        accent: "#1890ff",
      },
      container: {
        padding: "1rem",
      },
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false, // disable preflight to avoid conflicts with antd
  },
};
