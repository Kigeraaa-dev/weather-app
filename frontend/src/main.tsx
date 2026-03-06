/**
 * main.tsx
 *
 * The entry point of the React app.
 * This file finds the <div id="root"> in index.html
 * and mounts the entire App component inside it.
 *
 * React.StrictMode helps catch bugs during development
 * by running components twice (only in dev mode, not production).
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
