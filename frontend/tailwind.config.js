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
                primary: "#00f2fe",
                "primary-accent": "#fe0979",
                background: "#000000",
                surface: "#09090b",
                "surface-hover": "#18181b",
                border: "#27272a",
                "border-subtle": "#18181b",
                muted: "#71717a",
            },
            fontFamily: {
                sans: ["Space Grotesk", "sans-serif"],
                mono: ["Space Mono", "monospace"],
                display: ["Space Grotesk", "sans-serif"]
            },
            boxShadow: {
                brutal: "4px 4px 0px #00f2fe",
                "brutal-pink": "4px 4px 0px #fe0979",
                "brutal-white": "4px 4px 0px #ffffff",
            }
        },
    },
    plugins: [],
}
