import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta do Universo dos Oráculos
        primary: {
          500: '#6A0077', // Roxo principal
          600: '#8D08D4', // Roxo mais claro
        },
        accent: '#AEA700', // Amarelo/dourado para elementos
        text: '#F4F4F4',   // Cor das fontes
        dark: '#090909',   // Background header/footer
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6A0077 0%, #8D08D4 100%)',
      },
    },
  },
  plugins: [],
};
export default config;