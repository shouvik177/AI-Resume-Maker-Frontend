/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"], // Enables dark mode with a class
	content: [
	  "./pages/**/*.{js,jsx,ts,tsx}",
	  "./components/**/*.{js,jsx,ts,tsx}",
	  "./app/**/*.{js,jsx,ts,tsx}",
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border, 220 13% 91%))",
		  input: "hsl(var(--input, 0 0% 100%))",
		  ring: "hsl(var(--ring, 252 94% 67%))",
		  background: "hsl(var(--background, 0 0% 100%))",
		  foreground: "hsl(var(--foreground, 222 47% 11%))",
		  primary: {
			DEFAULT: "hsl(var(--primary, 221 83% 53%))",
			foreground: "hsl(var(--primary-foreground, 0 0% 100%))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary, 211 100% 50%))",
			foreground: "hsl(var(--secondary-foreground, 0 0% 100%))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
			foreground: "hsl(var(--destructive-foreground, 0 0% 100%))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted, 220 14% 75%))",
			foreground: "hsl(var(--muted-foreground, 220 10% 40%))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent, 265 100% 50%))",
			foreground: "hsl(var(--accent-foreground, 0 0% 100%))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover, 210 25% 95%))",
			foreground: "hsl(var(--popover-foreground, 210 20% 20%))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card, 0 0% 100%))",
			foreground: "hsl(var(--card-foreground, 220 13% 13%))",
		  },
		  chart: {
			1: "hsl(var(--chart-1, 341 100% 55%))",
			2: "hsl(var(--chart-2, 48 100% 55%))",
			3: "hsl(var(--chart-3, 174 100% 40%))",
			4: "hsl(var(--chart-4, 212 100% 50%))",
			5: "hsl(var(--chart-5, 285 100% 50%))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius, 8px)",
		  md: "calc(var(--radius, 8px) - 2px)",
		  sm: "calc(var(--radius, 8px) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  