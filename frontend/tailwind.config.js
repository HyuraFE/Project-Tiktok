/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#ffffff",
                "primary-foreground": "#000000",
                background: "#080808",
                surface: "#121212",
                "surface-hover": "#1a1a1a",
                border: "#262626",
                "border-subtle": "#1a1a1a",
                muted: "#888888",
            },
            fontFamily: {
                sans: ["DM Sans", "sans-serif"],
                display: ["Syne", "sans-serif"]
            },
        },
    },
    plugins: [],
}