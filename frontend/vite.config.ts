// vite.config.ts
//
// Vite is the tool that:
//   1. Runs a fast development server (npm run dev)
//   2. Bundles your code for production (npm run build)
//
// The proxy setting below is very important:
//   When React calls /api/weather, Vite forwards it to http://localhost:8080/api/weather


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,    // React dev server runs on this port
    open: true,    // Automatically opens your browser when you run: npm run dev

    proxy: {
      "/api": {
        target:       "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
