import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Ensures local routing works
  },
  preview: {
    historyApiFallback: true, // Ensures preview mode also works
  }
});