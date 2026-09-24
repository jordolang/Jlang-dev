const colors = require("tailwindcss/colors");

// Brand palette sampled from the JLang Development logo: brushed gold + brushed
// silver on black/white. The legacy indigo/purple/violet/pink and blue/cyan
// utilities used across the site are remapped onto these scales so every
// existing class picks up the brand without a sweeping rename.
const gold = {
	50: "#FBF7EE",
	100: "#F5ECD6",
	200: "#EBD8AC",
	300: "#E0C282",
	400: "#D4AC5F",
	500: "#C39445",
	600: "#9C7433",
	700: "#7A5A25",
	800: "#5C431B",
	900: "#443214",
	950: "#2A1E0A",
};
const silver = {
	50: "#F7F7F8",
	100: "#EDEEF0",
	200: "#DADCE0",
	300: "#BFC2C8",
	400: "#A2A6AE",
	500: "#82868F",
	600: "#62666E",
	700: "#4B4E55",
	800: "#36383D",
	900: "#232427",
	950: "#141517",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				gold,
				silver,
				indigo: gold,
				purple: gold,
				violet: gold,
				pink: gold,
				fuchsia: gold,
				blue: silver,
				sky: silver,
				cyan: silver,
				gray: colors.neutral,
				slate: colors.neutral,
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				sans: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
			animation: {
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				float: "float 3s ease-in-out infinite",
				"gradient-shift": "gradient-shift 15s ease infinite",
				typing:
					"typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
				"particle-float": "particle-float 4s linear infinite",
				glitch: "glitch 1s, blur 0.2s ease-out",
			},
			keyframes: {
				"pulse-glow": {
					"0%, 100%": {
						opacity: "1",
						boxShadow: "0 0 5px rgba(195, 148, 69, 0.5)",
					},
					"50%": {
						opacity: "0.8",
						boxShadow:
							"0 0 20px rgba(195, 148, 69, 0.8), 0 0 30px rgba(162, 166, 174, 0.6)",
					},
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"gradient-shift": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
				typing: {
					from: { width: "0" },
					to: { width: "100%" },
				},
				"blink-caret": {
					"from, to": { borderColor: "transparent" },
					"50%": { borderColor: "#C39445" },
				},
				"particle-float": {
					"0%": {
						transform: "translateY(0px) rotate(0deg)",
						opacity: "1",
					},
					"100%": {
						transform: "translateY(-100px) rotate(360deg)",
						opacity: "0",
					},
				},
				glitch: {
					"0%": {
						textShadow:
							"0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00",
					},
					"15%": {
						textShadow:
							"0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00",
					},
					"16%": {
						textShadow:
							"-0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00",
					},
					"49%": {
						textShadow:
							"-0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00",
					},
					"50%": {
						textShadow:
							"0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00",
					},
					"99%": {
						textShadow:
							"0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00",
					},
					"100%": {
						textShadow:
							"-0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff, -0.04em -0.025em 0 #fffc00",
					},
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"grid-white":
					"linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
				"grid-black":
					"linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
			},
		},
	},
	plugins: [],
};
