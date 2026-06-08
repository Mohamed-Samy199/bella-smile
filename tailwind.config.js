import withMT from "@material-tailwind/react/utils/withMT";
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#66BBEE",
        darkColor: "#003366",
      },


      fontFamily: {
        acumin: ['"Acumin Variable Concept"', "sans-serif"],
        berlin: ['"Berlin Sans FB"', "Arial", "sans-serif"],
      },
      keyframes: {
        'translate-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' }, // adjust distance here
        },
      },
      animation: {
        'translate-up': 'translate-up 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
});
