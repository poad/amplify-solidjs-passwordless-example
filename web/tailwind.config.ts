import kobalte from "@kobalte/tailwindcss";
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    // default prefix is "ui"
		kobalte,
		// or with a custom prefix:
		kobalte({ prefix: "kb" }),
  ],
};
