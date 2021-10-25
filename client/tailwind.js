module.exports = {
    purge: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                primary: "var(--primary-color)",
                "primary-light": "var(--primary-light-color)",
                secondary: "var(--secondary-color)",
                "white-gray": "var(--text-white-color)",
                "dark-white": "var(--text-color)"
            }
        }
    },
    variants: {},
    plugins: [require("tailwindcss"), require("autoprefixer")]
};