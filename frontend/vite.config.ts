import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * vite.config.ts
 * ──────────────
 * Vite configuration file. Controls how your React app is built and
 * how the development server behaves.
 *
 * KEY CONCEPT — The Proxy:
 *   In development (npm run dev), your React app runs on port 5173
 *   and your Java backend runs on port 8080.
 *   They are on DIFFERENT ports, so the browser would normally block
 *   requests between them (this is called CORS blocking).
 *
 *   The proxy below tells Vite's dev server:
 *   "Any request to /api/... — forward it to the backend for me."
 *   This makes CORS a non-issue during local development.
 *
 *   In production (deployed on Vercel), the proxy is NOT used.
 *   Instead, weatherApi.ts uses the VITE_BACKEND_URL environment variable
 *   to call the Railway backend directly.
 */
export default defineConfig({
  plugins: [react()],

  server: {
    // Port your React dev server runs on locally
    port: 5173,

    // Automatically open the browser when you run npm run dev
    open: true,

    proxy: {
      // Any request starting with /api will be forwarded to your backend.
      // process.env.VITE_BACKEND_URL reads the env variable if set,
      // otherwise falls back to localhost:8080 for local development.
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8080",

        // changeOrigin: true — rewrites the request's Host header to match
        // the target. Required for most backends to accept the proxied request.
        changeOrigin: true,
      }
    }
  }
});